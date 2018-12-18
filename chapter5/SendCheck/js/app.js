const RippleAPI = require('ripple-lib').RippleAPI;
const decodeAddress = require('ripple-address-codec').decodeAddress;
const createHash = require('crypto').createHash;

	var api = new RippleAPI({server:'wss://s.altnet.rippletest.net:51233'});
	var fetchBalance;
	$('document').ready(function(){
		login();
		$('.progress').hide();
		$('#sendCheckButton').click(function(){
				showsendCheckModal();
		});
		$('#logoutButton').click(function(){
				logout();
		});
		$("#loginButton").click(function(){
				storeCredentials();
		});
		$("#createCheckButton").click(function(){
			createCheck();
		});
	});

	function login(){
		if(!localStorage.getItem("loggedIn")){
			$('#loginModal').modal('show');
		} else{
			updateAccount();
		}
	}

	function logout(){
		localStorage.clear();
		clearInterval(fetchBalance);
		location.reload();
	}

	function updateAccount(){
		$('#rippleAddress').text(localStorage.getItem('rippleAddress'));
		updateBalance();
	}

	function storeCredentials(){
		localStorage.setItem("rippleAddress", $('#inputRippleAddress').val());
		localStorage.setItem("secret", $('#inputSecret').val());
		localStorage.setItem("loggedIn", true);
		$('#loginModal').modal('hide');
		updateAccount();
	}

	$("form").submit(function(e) {
		e.preventDefault();
	});

	function updateBalance(){
		api.connect().then(() => {
			const accountAddress = localStorage.getItem("rippleAddress");
			return api.getAccountInfo(accountAddress);
		}).then(info => {
			$('#balance').text("Account Balance : " + info.xrpBalance+ " XRP");
		}).then(() => {
			return api.disconnect();
		}).catch(console.error);
	}

	function showsendCheckModal(){
		$('#sendCheckModal').modal('show');
	}

	function createCheck(){
		$('.progress').show();
		const instructions = {};
		const sourceAddress = localStorage.getItem('rippleAddress');
		const sourceSecret = localStorage.getItem('secret');
		const destinationAddress = $('#inputDestinationRippleAddress').val();
		const options = {};

		api.connect().then(() => {

		return api.prepareCheckCreate(sourceAddress, {
					"destination": destinationAddress,
					"sendMax": {
						"currency": "XRP",
						"value": "100"
					}
				}, options).then(prepared => {
				$('.progress-bar').css('width', 40+'%').attr('aria-valuenow', 40);
				const {signedTransaction} = api.sign(prepared.txJSON, sourceSecret);
				api.submit(signedTransaction).then(onSuccess,onFailure);
			});
		});
	}

	function calculateCheckID(transaction){
		const checkIDhasher = createHash('sha512');
		checkIDhasher.update(Buffer.from('0043', 'hex'));
		checkIDhasher.update(new Buffer(decodeAddress(localStorage.getItem('rippleAddress'))));
		const seqBuf = Buffer.alloc(4);
		seqBuf.writeUInt32BE(transaction['tx_json']['Sequence'], 0);
		checkIDhasher.update(seqBuf);
		const checkID = checkIDhasher.digest('hex').slice(0,64).toUpperCase();
		$('#checkOutput').text("Check ID : "+checkID);
	}

	function onSuccess(message){
		$('.progress-bar').css('width', 100+'%').attr('aria-valuenow', 100);
		bootstrap_alert.success('Transaction Submitted Successfully');
		calculateCheckID(message);
		clear();
	}

	function onFailure(message){
		$('.progress-bar').css('width', 100+'%').attr('aria-valuenow', 100);
		bootstrap_alert.danger('Transaction Submission Failed');
		clear();
	}

	function clear(){
		disconnect();
		$('#sendCheckModal').modal('hide');
		$('.progress-bar').css('width', 0+'%').attr('aria-valuenow', 0);
		$(".progress").hide();
	}

	function disconnect(){
		api.disconnect().then(()=> {
		})
	}

	bootstrap_alert = function() {}

	bootstrap_alert.success = function(message) {
		$('#alert').html('<div role="alert" id="success-alert" class="alert alert-success"><p>'+message+'</p></div>');
		$("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
				$("#success-alert").slideUp(500);
		});
	}
	bootstrap_alert.danger = function(message) {
			$('#alert').html('<div role="alert" id="danger-alert" class="alert alert-danger"><p>'+message+'</p></div>');
			$("#danger-alert").fadeTo(2000, 500).slideUp(500, function(){
		$("#danger-alert").slideUp(500);
});
		}

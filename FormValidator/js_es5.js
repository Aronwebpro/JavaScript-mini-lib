'use strict';

var FormValidator = (function() {
	return {
		setup: function setup(formId, params) {
			if (!formId) {
				return;
			}
			params === undefined ? (this.params = {}) : (this.params = params);
			params.name === undefined ? (this.params.name = /^[a-zA-Z ]+$/) : (this.params.name = params.name);
			params.email === undefined
				? (this.params.email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
				: (this.params.email = params.email);
			params.phone === undefined
				? (this.params.phone = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/)
				: (this.params.phone = params.phone);
			params.ajax === undefined ? (this.params.ajax = false) : (this.params.ajax = params.ajax);
			params.formUrl === undefined ? (this.params.formUrl = 'form_email.php') : (this.params.formUrl = params.formUrl);
			formId ? (this.formId = formId) : (this.formId = '#form');
			this.form = document.querySelector(this.formId);
			this.submitBtn = document.querySelector(this.formId + ' input[type=submit]');
			this.form.addEventListener('submit', this.submit(this.params, this));
		},
		ajaxRequest: function ajaxRequest(method, url, data, success) {
			if (window.XMLHttpRequest) {
				var xhr = new XMLHttpRequest();
			} else {
				var xhr = new ActiveXObject('Microsoft.XMLHTTP');
			}

			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					success(xhr.responseText);
				}
			};

			xhr.open(method, url);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			method === 'POST' ? xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded') : 0;
			xhr.send(data);
		},
		displayMsg: function displayMsg() {
			var msg = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
			var type = arguments[1];
			var form = arguments[2];

			var element = document.createElement('div');
			var text = '<ul>' + msg.join('') + '</ul>';
			form.parentNode.insertBefore(element, form);
			element.setAttribute('class', 'error-box');
			element.innerHTML = text;

			if (type === 'error') {
				element.style.cssText = 'border: 2px solid #ce1818; color:#ce1818;';
			} else {
				element.style.cssText = 'border: 2px solid #5d7bad; color:#5d7bad;';
			}
		},

		//validate input and send Ajax request if set up
		submit: function submit(params, obj) {
			return function(event) {
				var _this = this;

				event.stopImmediatePropagation();
				var fields = [].slice.call(this.querySelectorAll('input')).filter(function(e) {
					return e.type === 'submit' ? 0 : e;
				});
				var text = this.querySelector('textarea');
				var errors = [];
				var formData = {};
				//Get all input fields and push to formData
				fields.forEach(function(e) {
					if (params.hasOwnProperty(e.name)) {
						e.style.border = '2px solid #ce1818';
						switch (true) {
							case e.value == '':
								errors.push('<li>' + e.name.charAt(0).toUpperCase() + e.name.slice(1) + " can't be empty!</li>");
								break;
							case !params[e.name].test(e.value):
								errors.push('<li>' + e.name.charAt(0).toUpperCase() + e.name.slice(1) + ' is incorrect!</li>');
								break;
							default:
								e.style.border = '';
								formData[e.name] = e.value;
						}
					}
				});
				//Get message text and push to formData
				if (text.value == '') {
					errors.push('<li>Please leave a message!</li>');
					text.style.border = '2px solid #ce1818';
				} else {
					text.style.border = '';
					formData['msg'] = text.value;
				}
				//Remove ald error box if were existed
				var old = document.querySelector('.error-box');
				if (old) {
					old.parentNode.removeChild(old);
				}
				//if no errors
				if (errors.length === 0) {
					//Ajax request if requested params:{ajax:true}
					if (obj.params.ajax === true) {
						event.preventDefault();
						var data = JSON.stringify(formData);
						obj.ajaxRequest('POST', obj.params.formUrl, data, function(resp) {
							var res = JSON.parse(resp);
							var respMsg = Object.keys(res).map(function(e) {
								return res[e];
							});

							if (res.hasOwnProperty('error')) {
								obj.displayMsg(respMsg, 'error', _this);
							} else {
								obj.displayMsg(respMsg, 'success', _this);
								fields.forEach(function(e) {
									return (e.value = '');
								});
								text.value = '';
							}
						});
					}
				} else {
					event.preventDefault();
					obj.displayMsg(errors, 'error', this);
				}
			};
		}
	};
})();

//to make ajax call on submit pass "{ ajax: true, formUrl: 'php/form_email.php' }"
//also can pass any form id on page
FormValidator.setup('#contact-me', {});

var sm = require('service-metadata');
var hm = require('header-metadata');
var fs = require('fs');
var errorCode = sm.getVar('var://service/error-code');
var suberrorCode = sm.getVar('var://service/error-subcode');

session.input.readAsBuffer(function(error, buffer) {
			if (error) {
				hm.response.statusCode = '500 Internal Server Error';
				session.output.write({
					'statusCode': hm.response.statusCode,
					'message': 'could not read input'
				});
				throw error;
			} else {
				var dpcodes = "local:///dpcodes.json";
				fs.readAsJSON(dpcodes, function(error, data) {
						if (error) {
							console.error("wtf");
							hm.response.statusCode = '500 Internal Server Error';
							session.output.write({
								'statusCode': hm.response.statusCode,
								'message': 'could not read local:dpcode file'
							});
							throw error;
						} else {
							if (suberrorCode&&suberrorCode!="0x00000000"&&suberrorCode!="0x00c30010") {
								console.error("subcode: "+suberrorCode);
								for (let i = 0; i < data.EventCodes.length; i += 1) {
									if (data.EventCodes[i].hasOwnProperty(suberrorCode)) {
										hm.response.statusCode = '500 Internal Server Error';
										session.output.write({
											'statusCode': suberrorCode,
											'message': data.EventCodes[i][suberrorCode]
										});
									}
								}
							} else {
								console.error("errorCode: "+errorCode);
								for (let i = 0; i < data.EventCodes.length; i += 1) {
									if (data.EventCodes[i].hasOwnProperty(errorCode)) {
										hm.response.statusCode = '500 Internal Server Error';
										session.output.write({
											'statusCode': errorCode,
											'message': data.EventCodes[i][errorCode]
										});
									}
								}
							}
						}
				}
			);
			}
});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Password Hasher Plus
 *
 * The Initial Developer of the Original Code is Eric Woodruff.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s): (none)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
String.prototype.startsWith = function(str) {
	return (this.match("^" + str) == str);
};

String.prototype.substringAfter = function(str) {
	return (this.substring(this.indexOf(str) + str.length));
};

String.GUID = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	}).toUpperCase();
};

function generateGuid() {
	$('#salt').val(String.GUID());
	update();
}

function generateHash(config, input) {
	var site = config.site;

	if (!site.startsWith("compatible:")) {
		site = PassHashCommon.generateHashWord(config.salt, site, 24, true, // require
		true, // require punctuation
		true, // require mixed case
		false, // require special characters
		false // only digits
		);
	} else {
		site = site.substringAfter(":");
	}

	return PassHashCommon.generateHashWord(site, input, config.length, true, // require
	config.strength > 1, // require punctuation
	true, // require mixed case
	config.strength < 2, // require special characters
	config.strength == 0 // only digits
	);
}

function togglePasswords(e) {
	var type;
	console.log('togglePass', $('#showpass').attr("checked"), e);
	if ($('#showpass').attr("checked") == "true") {
		type = "password";
	} else {
		type = "text";
	}

	$('.password').each(function(i) {
		var ele = $(this).get(0);
		ele.type = type;
	});
}

function bumpLabel() {
	var re = new RegExp("^([^:]+?)(:([0-9]+))?$");
	var site = $('#site').val();
	if (site.startsWith("compatible:")) {
		site = site.substringAfter("compatible:");
	}
	var matcher = re.exec(site);
	var bump = 1;
	if (null != matcher[3]) {
		site = matcher[1];
		bump += parseInt(matcher[3]);
	}
	$("#site").val(site + ":" + bump);
}

function update() {
	var hash = '', config = {};
	config.site = $('#site').val();
	config.salt = $('#salt').val();
	config.length = $("#passlength").val();
	config.strength = $('#strength').val();
	hash = generateHash(config, $('#password').val());

	$('#hash').val(hash);
}

$('#mainPage').live('pagecreate', function() {

	$('#bumpBtn').click(bumpLabel);
	$('#guidBtn').click(generateGuid);

	$('#showpass').bind('tap click', togglePasswords);
	$('.input').bind('keydown keyup change', update);

	$('#hash').bind("click", function() {
		$('#hash').get(0).select();
	});
});

$(function() {
	$('#site').autocomplete(
			{
				source : function(request, response) {
					var data = {
						results : [ {
							data : {
								fullName : "test",
								id : "test"
							}
						} ]
					};

					response($.map(data.results, function(item) {
						return {
							label : '<span>'
									+ item.data.fullName + '</span>',
							value : item.data.id
						};
					}));
				}

			});

	// override private autocomplete method which encodes html and creates
	// anchor
	// with no href
	$('#site').data("autocomplete")._renderItem = function(ul, item) {
		return $("<li></li>").data("item.autocomplete", item).append(
				$("<a></a>").attr({
					href : '#'
				}).html(item.label)).appendTo(ul);
	};
});

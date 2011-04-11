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

String.UUID = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	}).toUpperCase();
};

function generateUuid() {
	$('#salt').val(String.UUID());
	updateDisplay();
}

var pconfig;
pconfig = new Lawnchair({
	display : "Phasher Config",
	name : 'pconfig',
	version : "1.0",
	adaptor : 'webkit'
}, function(lc) {
	return lc;
});

function init() {

	pconfig.all(function(c) {

		c = $.map(c, function(item) {
			return {
				value : item.key,
				label : item.sitelabel
			};
		});

		$('#sitelabel').autocomplete({
			source : c
		});

		/* fix for mobile */
		$('#sitelabel').data("autocomplete")._renderItem = function(ul, item) {
			return $("<li></li>").data("item.autocomplete", item).append(
					$("<a></a>").attr({
						href : '#'
					}).html(item.label)).appendTo(ul);
		};
	});

}

function updateConfig() {
	var config = getConfig();

	if (config.key && config.key != "" && config.password)
		pconfig.save(config);
}

function deleteConfig() {

}

function generateHash(config, input) {
	var sitelabel = config.sitelabel;

	// hash the sitelabel with the salt
	if (!sitelabel.startsWith("compatible:")) {
		sitelabel = PassHashCommon.generateHashWord(config.salt, sitelabel, 24,
				true, // require
				true, // require punctuation
				true, // require mixed case
				false, // require special characters
				false // only digits
		);
	} else {
		sitelabel = sitelabel.substringAfter(":");
	}

	// hash the password with the hashed salt
	return PassHashCommon.generateHashWord(sitelabel, input, config.length,
			true, // require
			config.strength > 1, // require punctuation
			true, // require mixed case
			config.strength < 2, // require special characters
			config.strength == 0 // only digits
	);
}

function togglePasswords(e) {
	var type;

	type = ($('#hidepass option:selected').val() == "true") ? "password"
			: "text";

	$('.password').each(function(i) {
		var ele = $(this).get(0);
		ele.type = type;
	});
}

function bumpLabel(e) {
	var bump = 1, re = new RegExp("^([^:]+?)(:([0-9]+))?$"), label = $("#sitelabel").val(), matcher;

	if (label.startsWith("compatible:")) {
		label = label.substringAfter("compatible:");
	}
	
	matcher = re.exec(label);

	if (null != matcher[3]) {
		label = matcher[1];
		bump += parseInt(matcher[3]);
	}
	
	$("#sitelabel").val(label + ":" + bump);
	$('#sitelabel').trigger('change');
}

function updateDisplay(e) {
	var hash = '', config = getConfig();

	if($(e.currentTarget).attr('id') == 'sitelabel' && e.type == 'autocompletechange') {
		
		pconfig.find('r.key == "' + $('#sitelabel').val() + '"', loadConfig);
		
		return false;
	}
	
	hash = generateHash(config, config.password);

	$('#hash').val(hash);
}

function loadConfig(r){
	
	$('#salt').val(r.salt);
	$("#passlength").val(r.length).slider("refresh");
	
	$("#strength")[0].selectedIndex = r.strength;
	$('#strength').selectmenu("refresh");
	
	$('#password').val(r.password);

	$('#sitelabel').trigger('change');
}

function getConfig() {
	var config = {};
	
	config.key = $('#sitelabel').val();
	config.sitelabel = $('#sitelabel').val();
	config.salt = $('#salt').val();
	config.length = $("#passlength").val();
	config.strength = $('#strength').val();
	config.password = $('#password').val();
	
	return config;
}

$('#mainPage').live('pagecreate', function() {

	$('#bumpBtn').click(bumpLabel);
	$('#uuidBtn').click(generateUuid);

	$('#hidepass').bind('change', togglePasswords);
	
	$('.input').bind('change autocompletechange', updateDisplay);
	$('.input').bind('blur', updateConfig);

	$('#hash').bind("click", function() {
		$('#hash').get(0).select();
	});
});

$(init);

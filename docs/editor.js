/**
 * jsPDFEditor
 * @return {[type]} [description]
 */
var jsPDFEditor = function () {

	var editor;

	var aceEditor = function () {
		editor = ace.edit("editor");
		editor.setTheme("ace/theme/github");
		editor.getSession().setMode("ace/mode/javascript");
		editor.getSession().setUseWorker(false); // prevent "SecurityError: DOM Exception 18"

		var timeout;
		editor.getSession().on('change', function () {
			// Hacky workaround to disable auto refresh on user input
			if ($('#auto-refresh').is(':checked')) {
				if (timeout) clearTimeout(timeout);
				timeout = setTimeout(function () {
					jsPDFEditor.update();
				}, 200);
			}
		});
	};

	var loadSourceCode = function () {
		// Fallback source code
		var source = "var doc = new jsPDF();\n";
		source += "\n";
		source += "doc.addFont('Batang.ttf', 'Batang', 'normal');\n";
		source += "doc.addFont('NotoSansCJKjp-Regular.ttf', 'NotoSansCJKjp', 'normal');\n";
		source += "doc.addFont('NotoSansCJKtc-Regular.ttf', 'NotoSansCJKtc', 'normal');\n";
		source += "\n";

		source += "doc.setFont('Batang');\n";
		source += "doc.text(15, 15, '안녕하세요 만나서 반갑습니다.');\n";
		source += "\n";
		source += "doc.setFont('NotoSansCJKjp');\n";
		source += "doc.text(15, 30, 'こんにちは。はじめまして。');\n";
		source += "\n";
		source += "doc.setFont('NotoSansCJKtc');\n";
		source += "doc.text(15, 45, '早上好。 很高兴见到你');\n";
		source += "\n";

		source += `//multi-lines Test\n`;
		source += `var paragraph = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit,' +
            ' sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
            ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris' +
            ' nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor ' +
            'in reprehenderit in voluptate velit esse cillum dolore eu fugiat ' +
            'nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
            'sunt in culpa qui officia deserunt mollit anim id est laborum.';\n`;
		source += `var lines = doc.splitTextToSize(paragraph, 150);\n`;
		source += `doc.text(15, 60, lines);\n`;

		editor.setValue(source);
		editor.gotoLine(0);
	};

	var initAutoRefresh = function () {
		$('#auto-refresh').on('change', function () {
			if ($('#auto-refresh').is(':checked')) {
				$('.run-code').hide();
				jsPDFEditor.update();
			} else {
				$('.run-code').show();
			}
		});

		$('.run-code').click(function () {
			jsPDFEditor.update();
			return false;
		});
	};

	var initDownloadPDF = function () {
		$('.download-pdf').click(function () {
			eval('try{' + editor.getValue() + '} catch(e) { console.error(e.message,e.stack,e); }');

			var file = demos[$('#template').val()];
			if (file === undefined) {
				file = 'demo';
			}
			if (typeof doc !== 'undefined') {
				doc.save(file + '.pdf');
			} else if (typeof pdf !== 'undefined') {
				setTimeout(function () {
					pdf.save(file + '.pdf');
				}, 2000);
			} else {
				alert('Error 0xE001BADF');
			}
		});
		return false;
	};

	return {
		/**
		 * Start the editor demo
		 * @return {void}
		 */
		init: function () {

			// Init the ACE editor
			aceEditor();

			loadSourceCode();
			// Do the first update on init
			jsPDFEditor.update();

			initAutoRefresh();

			initDownloadPDF();
		},
		/**
		 * Update the iframe with current PDF.
		 *
		 * @param  {boolean} skipEval If true, will skip evaluation of the code
		 * @return
		 */
		update: function (skipEval) {
			setTimeout(function () {
				if (!skipEval) {
					eval('try{' + editor.getValue() + '} catch(e) { console.error(e.message,e.stack,e); }');
				}
				if (typeof doc !== 'undefined') try {
					if (navigator.msSaveBlob) {
						// var string = doc.output('datauristring');
						string = 'http://microsoft.com/thisdoesnotexists';
						console.error('Sorry, we cannot show live PDFs in MSIE')
					} else {
						var string = doc.output('bloburi');
					}
					$('.preview-pane').attr('src', string);
				} catch (e) {
					alert('Error ' + e);
				}
			}, 0);
		}
	};

}();

$(document).ready(function () {
	jsPDFEditor.init();
});
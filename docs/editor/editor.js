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
		source += "doc.addFont('NotoSansCJKjp-Regular.ttf', 'NotoSansCJKjp', 'normal');\n";
		source += "\n";

		source += "doc.setFont('NotoSansCJKjp');\n";
		source += "doc.text(15, 15, 'こんにちは。はじめまして。');\n";
		source += "\n";

		source += `//multi-lines Test\n`;
		source += `var paragraph = '相次いで廃止された寝台列車に代わり、いまや夜間の移動手段として主力になりつつある夜行バス。「安い」「寝ながら移動できる」などのメリットを生かすため、運行ダイヤはどのように組まれているのでしょうか。夜遅く出て、朝早く着くというメリット夜行バスを使うメリットといえば、各種アンケートでもいちばん多い回答の「安い」以外に、';\n`;
		source += `var lines = doc.splitTextToSize(paragraph, 150);\n`;
		source += `doc.text(15, 30, lines);\n`;

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

			var file = 'demo';

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

	var initFileSelect = function () {
		$('#filePicker').on('change', function (evt) {
			var files = evt.target.files;
			var file = files[0];

			if (files && file) {
				var reader = new FileReader();

				reader.onload = function (readerEvt) {
					var binaryString = readerEvt.target.result;

					var source = "var doc = new jsPDF();\n";
					source += "\n";
					source += `doc.addFileToVFS('${file.name}','${btoa(binaryString)}');\n`;
					source += "\n";
					source += `doc.addFont('${file.name}', 'custom', 'normal');\n`;
					source += "\n";

					source += "doc.setFont('custom');\n";
					source += "doc.text(15, 15, 'Hello World');\n";

					editor.setValue(source);
					editor.gotoLine(0);
				};

				reader.readAsBinaryString(file);
			}
		});
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

			initFileSelect();

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
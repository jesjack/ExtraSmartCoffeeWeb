<?php include 'layouts/head.php' ?>
<style>
	i {
		transition: color .1s ease;
	}
</style>
<div class="container">
	<br>
	<table class="table table-hover table-dark table-sm">
			<thead>
				<tr>
					<th scope="col" colspan="2">
							<a href="#" type="button" class="btn btn-dark btn-sm" id="back">
									<i class="fas fa-long-arrow-alt-left"></i>
							</a>
							<script>
									let url = window.location.pathname+window.location.search;
									url += (url.charAt(url.length - 1) == '/') ? '' : '/';
									$('#back').attr('href', url + '..')
							</script>
							<?= $path ?>
					</th>
					<th scope="col" class="text-right align-middle">
						<button
							type="button"
							class="btn btn-primary btn-sm"
							id="addFileButton"
							data-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
						>
							<i class="fas fa-plus"></i>
						</button>
						<div class="dropdown-menu" aria-labelledby="addFileButton">
							<form id="sendFileForm" class="px-4 py-3" method="POST" action="/file/createfile" enctype="multipart/form-data">
								<div class="form-group">
									<input type="file" name="file" id="file" required onchange="
										$('#fileName').val($('#file').val().split('\\')[$('#file').val().split('\\').length - 1]);
										$('#fileName')[0].focus();
									">
								</div>
								<div class="form-group">
									<input
										type="text"
										name="fileName"
										id="fileName"
										class="form-control"
										placeholder="file.txt o folder/"
										aria-describedby="file name"
										required
										autocomplete="off"
									>
								</div>
									<div class="progress">
										<div id="upProgress" class="progress-bar progress-bar-striped progress-bar-animated bg-dark" role="progressbar" style="width: 0%"></div>
									</div>
								<input type="hidden" name="completePath" value="<?= $completePath ?>" id="completePath">
								<input type="hidden" name="preURL" id="preURL">
								<script>
									$('#sendFileForm').on('submit', (evt) => {
										var sus = true;
										var value = $('#fileName').val().toLowerCase().split('');
										var newVal = [];
										value.forEach(val => {
											newVal.push(val.charCodeAt(0));
										});
										newVal.forEach(val => {
											if(!(
												(val >= 97 && val <= 122)
												|| (val >= 45 && val <= 57)
												|| val == 95
											)){
												evt.preventDefault();
												sus = false;
												alert('Nombre de archivo o carpeta demasiado complicado :(');
											}
										});
										evt.preventDefault();
										if(sus) {
											var formdata = new FormData();
											if($('#file')[0].files != null) formdata.append('file', $('#file')[0].files[0]);
											formdata.append('fileName', $('#fileName').val());
											formdata.append('completePath', $('#completePath').val());
											formdata.append('preURL', $('#preURL').val());
											$('input').prop('disabled', true);
											var ajax = new XMLHttpRequest();
											ajax.upload.addEventListener('progress', evt => {
												var percent = (event.loaded / event.total) * 100;
												$('#upProgress').css({
													'width': percent + '%'
												});
											}, false);
											ajax.addEventListener('load', () => {
												$('#upProgress').css({
													'width': 100 + '%'
												});
												location.reload();
											}, false);
											ajax.open('POST', '/file/createfile');
											ajax.send(formdata);
										}
									});
									$('#preURL').val(document.URL);
									$('#fileName').keyup(evt => {
										if($('#fileName').val().charAt($('#fileName').val().length - 1) == '/') {
											$('#file').attr('type', 'hidden');
										} else {
											$('#file').attr('type', 'file');
										}
									});
									$('#fileName').keydown(evt => {
										let code = evt.keyCode;
										let key = evt.key;
										let accept = 
											(
												code >= 65
												&& code <= 90
												&& !evt.shiftKey
												&& !evt.altKey
												&& !evt.ctrlKey
											) || (
												code >= 48
												&& code <= 57
												&& !evt.shiftKey
												&& !evt.altKey
												&& !evt.ctrlKey
											)
											|| key == '.'
											|| key == '/'
											|| key == '_'
											|| key == '-'
											|| key == 'Backspace'
											|| key == 'Enter'
										;
										if($('#fileName').val().charAt($('#fileName').val().length - 1) != '/') {
											if(key == 'Enter' && ($('#fileName').val() == '.' || $('#fileName').val() == '..') || $('#fileName').val() == '/') {
												evt.preventDefault();
											} else {
												if(!($('#fileName').val().includes('.') && key == '.'))
													//return accept;
													if(!accept) evt.preventDefault();
													else return true;
												else {
													evt.preventDefault();
												}
											}
										} else {
											return key == 'Backspace' || key == 'Enter';
										}
									});
								</script>
							</form>
						</div>
					</th>
				</tr>
			</thead>
			<tbody>
				<?php
				
				for($i = 0; $i < count($file); $i++) {
					?>
					<tr>
						<td class="align-middle" colspan="2">
							<?= $file[$i] ?>
						</td>
						<td class="text-right">
							<a href="/file<?= $path . $file[$i] ?>" type="button" class="btn btn-info btn-sm">
								<i class="fas fa-eye"></i>
							</a>
							<a type="button" class="btn btn-warning btn-sm" onclick="compress('/file<?= $path . $file[$i] ?>');">
								<i class="fas fa-file-archive"></i>
							</a>
							<a type="button" class="btn btn-danger btn-sm" onclick="delete_('/file<?= $path . $file[$i] ?>', $('#<?= explode('.', $file[$i])[0] . explode('.', $file[$i])[1] ?>_item'));">
								<i class="fas fa-trash" id="<?= explode('.', $file[$i])[0] . explode('.', $file[$i])[1] ?>_item"></i>
							</a>
							<form method="POST" action="/file/token/prepare" style="display:inline;">
								<input type="hidden" value="<?= $allPaths[$i] ?>" name="token">
								<button type="submit" class="btn btn-success btn-sm" onclick="">
									<i class="fas fa-share-alt" id="'+file.split('.')[0]+file.split('.')[1]+'_item"></i>
								</button>
							</form>
						</td>
					</tr>
					<?php
				}

				?>
			</tbody>
	</table>
	<script>
		var colorOut;
		function delete_(path, icon) {
			var color = icon.css('color');
			color = parseInt(color.split(', ')[1]);
			color -= 20;
			if(color <= 20) {
				icon[0].parentNode.onclick = evt => evt.preventDefault();
				$.ajax({
					url: path,
					type: 'DELETE',
					success: res => {
						location.reload();
					}
				});
			}
			icon.css('transition', 'color .1s ease');
			icon.css('color', 'rgb('+color+','+color+','+color+')');
			clearTimeout(colorOut);
			colorOut = setTimeout(() => {
				icon.css('transition', 'color 1s ease');
				icon.css('color', 'rgb('+255+','+255+','+255+')');
			}, 500);
		}

		function compress(path) {
			$.ajax({
				url: '/file/compress',
				type: 'POST',
				data: { path: path },
				success: res => {
					alert('Al finalizar la compresion encontraras el archivo en tu carpeta zips/');
				}
			});
		}
	</script>

</div>

<?php include 'layouts/foot.php' ?>
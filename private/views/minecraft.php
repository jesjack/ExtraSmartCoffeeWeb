<?php include 'layouts/head.php' ?>

<div class="d-sm-flex align-items-center justify-content-between mb-0">
  <h1 class="h3 mb-0 text-gray-800">ExtraMinecraftCoffee <span class="badge badge-dark"><?= $server ?></span></h1>
</div>

<div class="p-3">
	<div class="card border-left-info bg-dark p-3 shadow-lg" style="height: calc(100vh - 200px);">
		<pre id="console" class="text-light j-scroll-hidden" style="margin-bottom: -18px; height: 100%;" id="console"></pre>
		<div class="input-group input-group-sm" style="z-index: 2;">
			<input type="text" class="form-control bg-dark text-light" id="command">
			<div class="input-group-append">
				<button class="btn btn-light" onclick="sendCommand();"><i class="fas fa-check"></i></button>
			</div>
		</div>
	</div>
</div>

<script>
	$('#command').keypress(key => { if(key.code == 'Enter') { sendCommand(); } });
	$.ajax({
		url: '/minecraft/load/<?= $server ?>',
		success: res => {
			$('#console').html(res);

			var scroll_Q = true;
	    $('#console').scroll(evt => {
        var scroll_height = $('#console').prop('scrollHeight');
        var scroll_top = $('#console').scrollTop();
        scroll_Q = scroll_height ==
        	Math.round(scroll_top + $('#console').height() + 11)
        	|| scroll_height == Math.round(scroll_top + $('#console').height() - 17);
	    });
	    setInterval(()=> {
        if(scroll_Q) {
          var scroll_height = $('#console').prop('scrollHeight');
          $('#console').scrollTop(scroll_height);
        }
    	}, 1);
		}
	});

	(function autoLoad() {
			$.ajax({
				url: '/minecraft/output/<?= $server ?>',
				success: res => {
					if(res && (typeof res === 'string')) {
						$('#console').html(res);
					}
					autoLoad();
				}
			});
	})();

	function sendCommand() {
		$.ajax({
			url: '/minecraft/command/<?= $server ?>',
			type: 'post',
			data: {
				command: $('#command').val()
			}, success: res => {
				if(res && res != '') {
					const Toast = Swal.mixin({
					  toast: true,
					  position: 'top-end',
					  showConfirmButton: false,
					  timer: 3000,
					  timerProgressBar: true,
					  didOpen: (toast) => {
					    toast.addEventListener('mouseenter', Swal.stopTimer)
					    toast.addEventListener('mouseleave', Swal.resumeTimer)
					  }
					});

					Toast.fire({
					  icon: 'info',
					  title: res
					});
				}
			}
		});
	}
</script>

<?php include 'layouts/foot.php' ?>
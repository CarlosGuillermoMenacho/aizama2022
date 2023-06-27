<style type="text/css">
	input{
		max-width: 100px;
	}
</style>
<div>
	<input type="text" name="cel1" id="cel1">
	<input type="text" name="" id="cel11">
	<input type="text" name="" id="cont1" value="9999">
	<button onclick="bucle1();">CEL 1</button>
	<input type="text" name="cel1" id="cel2">
	<input type="text" name="" id="cel21">
	<input type="text" name="" id="cont2" value="20">
	<button onclick="bucle2();">CEL 2</button>
	<input type="text" name="cel1" id="cel3">
	<input type="text" name="" id="cel31">
	<input type="text" name="" id="cont3" value="20">
	<button onclick="bucle3();">CEL 3</button>
	<input type="text" name="cel1" id="cel4">
	<input type="text" name="" id="cel41">
	<input type="text" name="" id="cont4" value="20">
	<button onclick="bucle4();">CEL 4</button>
	<input type="text" name="cel1" id="cel5">
	<input type="text" name="" id="cel51">
	<input type="text" name="" id="cont5" value="20">
	<button onclick="bucle5();">CEL 5</button>
	<input type="text" name="cel1" id="cel6">
	<input type="text" name="" id="cel61">
	<input type="text" name="" id="cont6" value="20">
	<button onclick="bucle6();">CEL 6</button>
</div>
<div>
	<button onclick="session(1);">Session 1</button>
	<button onclick="session(2);">Session 2</button>
	<button onclick="session(3);">Session 3</button>
	<button onclick="session(4);">Session 4</button>
	<button onclick="session(5);">Session 5</button>
	<button onclick="session(6);">Session 6</button>
</div>

<table>
	<thead><tr><td>Números Whatsapp</td></tr></thead>
	<tbody id="body" style="display: flex;flex-wrap: wrap; font-size: .8em;">
		
	</tbody>
</table>
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript">
	let numeros = 1000;
	const bucle1 = async () => {
		return;
		let num = document.getElementById("cel1").value;
		let number = Number(num);
		for (var i = 0; i < numeros; i++) {
			if (number<60929943) {
				await $.get(
					`whatsapp_verify.php?phone=591${number}&server=1`,
					data => {
						if(data == "ok"){
							$("#cel11").val(number);
						}
						$("#cel1").val(number);
						$("#cont1").val(numeros - i);	
					},
					"text"
				);
				number = number+120;
			}else{
				return;
			}
				
		}
	}	
	const bucle2 = async () => {
		let num = document.getElementById("cel2").value;
		let number = Number(num);
		for (var i = 0; i < numeros; i++) {
			if (number<60929943) {
				await $.get(
					`whatsapp_verify.php?phone=591${number}&server=2`,
					data => {
						if(data == "ok"){
							$("#cel21").val(number);
						}
						$("#cel2").val(number);
						$("#cont2").val(numeros - i);	
					},
					"text"
				);
				number = number+120;	
			}else{
				return;
			}		
		}
	}
	const session = n =>{
		$.get(
			`beginSessions.php?op=${n}`,
			data => {
				alert(data);
			},
			"text"
		);
	}
	const bucle3 = async () => {
		return;
		let num = document.getElementById("cel3").value;
		let number = Number(num);
		for (var i = 0; i < numeros; i++) {
			await $.get(
				`whatsapp_verify.php?phone=591${number}&server=3`,
				data => {
					if(data == "ok"){
						$("#cel31").val(number);
					}
					$("#cel3").val(number);
					$("#cont3").val(numeros - i);	
				},
				"text"
			);
			number = number+120;			
		}
	}
	const bucle4 = async () => {
		return;
		let num = document.getElementById("cel4").value;
		let number = Number(num);
		for (var i = 0; i < numeros; i++) {
			await $.get(
				`whatsapp_verify.php?phone=591${number}&server=4`,
				data => {
					if(data == "ok"){
						$("#cel41").val(number);
					}
					$("#cel4").val(number);
					$("#cont4").val(numeros - i);	
				},
				"text"
			);
			number = number+120;			
		}
	}
	const bucle5 = async () => {
		return;
		let num = document.getElementById("cel5").value;
		let number = Number(num);
		for (var i = 0; i < numeros; i++) {
			await $.get(
				`whatsapp_verify.php?phone=591${number}&server=5`,
				data => {
					if(data == "ok"){
						$("#cel51").val(number);
					}
					$("#cel5").val(number);
					$("#cont5").val(numeros - i);	
				},
				"text"
			);
			number = number+120;			
		}
	}
	const bucle6 = async () => {
		return;
		let num = document.getElementById("cel6").value;
		let number = Number(num);
		for (var i = 0; i < numeros; i++) {
			await $.get(
				`whatsapp_verify.php?phone=591${number}&server=6`,
				data => {
					if(data == "ok"){
						$("#cel61").val(number);
					}
					$("#cel6").val(number);
					$("#cont6").val(numeros - i);	
				},
				"text"
			);
			number = number+120;			
		}
	}
</script>
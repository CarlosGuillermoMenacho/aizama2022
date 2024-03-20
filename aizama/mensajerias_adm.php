<?php
session_start();
require"session_verify.php";
require 'header_adm.php';
?>
<link rel="stylesheet" type="text/css" href="css/colors.css?v=<?php echo rand()?>">
<link rel="stylesheet" type="text/css" href="css/mensajerias_adm.css?v=<?php echo rand()?>">
<div class="main">
	<div class="div-content-chat">
		<div class="div-title">
			<h1>Mensajes de Whatsapp</h1>
		</div>
	</div>
	<div class="content-primary">
		
		<div class="div-list-chats">
			<ul>
				<li class="bl">
					<div class="div-search">
						<img src="svg/search.svg">
						<input type="text" name="" placeholder="Buscar chat">
					</div>
				</li>
				<li>
					<div class="list-chatings">
						<div class="item-list">
							<img class="img-user" src="images/user.png">
							<div class="div-span">
								<div class="span-nombre-chat">
									<span>Carlos Guillermo Menacho Zárate</span>
								</div>
								<div class="div-span-item">
									<span>Último mensaje de la joranda enviado</span>
								</div>								
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="list-chatings">
						<div class="item-list">
							<img class="img-user" src="images/user.png">
							<div class="div-span">
								<div class="span-nombre-chat">
									<span>Carlos Guillermo Menacho Zárate</span>
								</div>
								<div class="div-span-item">
									<span>Último mensaje de la joranda enviado</span>
								</div>								
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="list-chatings">
						<div class="item-list">
							<img class="img-user" src="images/user.png">
							<div class="div-span">
								<div class="span-nombre-chat">
									<span>Carlos Guillermo Menacho Zárate</span>
								</div>
								<div class="div-span-item">
									<span>Último mensaje de la joranda enviado</span>
								</div>								
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="list-chatings">
						<div class="item-list">
							<img class="img-user" src="images/user.png">
							<div class="div-span">
								<div class="span-nombre-chat">
									<span>Carlos Guillermo Menacho Zárate</span>
								</div>
								<div class="div-span-item">
									<span>Último mensaje de la joranda enviado</span>
								</div>								
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="list-chatings">
						<div class="item-list">
							<img class="img-user" src="images/user.png">
							<div class="div-span">
								<div class="span-nombre-chat">
									<span>Carlos Guillermo Menacho Zárate</span>
								</div>
								<div class="div-span-item">
									<span>Último mensaje de la joranda enviado</span>
								</div>								
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="div-chatting">
			<div class="div-contact-info bl">
				<div class="info-user">
					<img src="images/user.png" class="img-user">
					<div class="name-user">
						<h2>Nombre Ususario</h2>
						<h3>72635245</h3>
					</div>
				</div>
				<div class="div-contact-options">
					<img src="svg/three-dots-vertical.svg">
				</div>	
			</div>
			<div class="div-chats">
				<div class="div-fecha">
					<span>02/03/2024</span>
				</div>
				<div class="div-received">
					<div class="msn-content">
						<img class="span-cola" src="svg/msn-cola.svg">
						<span class="span-msn">Mensaje recibido<br>Hola que tal todo.</span>
						<span class="span-hora">12:50</span>
					</div>
				</div>
				<div class="div-send">
					<div class="msn-content-send">
						<img class="span-cola-send" src="svg/msn-cola-send.svg">
						<span class="span-msn">Mensaje enviado<br>Hola que tal todo.</span>
						<span class="span-hora">12:50</span>
					</div>
				</div>
			</div>
			<div class="div-text-writing">
				<div class="text-writer">
					<img src="svg/plus-gris.svg">
					<div class="div-input-text"><input type="text" name="" placeholder="Escribe un mensaje"></div>	
				</div>
				<div class="div-btn-send"><img src="svg/send.svg"></div>
			</div>
		</div>

		<div class="div-type-chat">
			<ul>
				<li><button class="btn-control">Cursos</button></li>
				<li><button class="btn-control">Tutores</button></li>
				<li><button class="btn-control">Tutores de Alumnos</button></li>
				<li><button class="btn-control">Docentes</button></li>
				<li><button class="btn-control">Personal</button></li>
			</ul>
		</div>
	</div>
</div>

<script type="text/javascript" src="js/mensajerias_adm.js?v=<?php echo rand()?>"></script>
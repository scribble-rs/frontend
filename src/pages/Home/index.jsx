import logo from '../../assets/logo.svg';
import './home.css';
import { JoinLobby } from './JoinLobby/join';
import { CreateLobby } from './CreateLobby/create';

function joinLobby(lobbyId) {
	window.location.href = 'http://localhost:8080/ssrEnterLobby/' + lobbyId;
}

export function Home() {
	return (
		<div class="home">
			< img id="logo" src={logo} alt="Scribble.rs logo" />

			<div id="home-choices">
				<CreateLobby joinLobby={joinLobby} />
				<b id="home-choices-or">OR</b>
				<JoinLobby joinLobby={joinLobby} />
			</div>
		</div >
	);
}

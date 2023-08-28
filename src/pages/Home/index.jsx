import { useEffect, useState } from 'preact/hooks';
import logo from '../../assets/logo.svg';
import kick from '../../assets/kick.png';
import './style.css';

function getLobbies() {
	return new Promise((resolve) => {
		fetch('http://localhost:8080/v1/lobby').
			then((response) => {
				response.json().then((data) => {
					console.log(data);
					resolve(data);
				});
			}).
			catch((error) => {
				console.error(error);
			});
	})
}

function languageToFlag(language) {
	switch (language) {
		case "english":
			return "🇺🇸";
		case "english_gb":
			return "🇬🇧";
		case "german":
			return "🇩🇪";
	}
}

function LobbyList(props) {
	return (
		<div id="lobby-list">
			{props.lobbies.map((lobby) => {
				return (
					<div
						onClick={() => props.selectLobby(lobby.lobbyId)}
						class={props.selectedLobby !== lobby.lobbyId ? "lobby-list-item" : "lobby-list-item selected"} >
						{/* FIXME Replace words with iconography, saves us the
						 effort to translate and looks less cluttered. */}
						<span style="text-shadow:-2px -2px 0 #AAAAAA, 2px -2px 0 #AAAAAA, -2px 2px 0 #AAAAAA, 2px 2px 0 #AAAAAA;">{languageToFlag(lobby.wordpack)}</span>
						<span>Players {lobby.playerCount}/{lobby.maxPlayers}</span>
						<span>Round {lobby.round}/{lobby.rounds}</span>
						{lobby.votekick ? <img src={kick} style="width: 2rem; height: 2rem;" alt="Votekick enabled" title="Votekick enabled" /> : null}
						<span>Drawing Time {lobby.drawingTime}</span>
						<span>Max Clients per IP {lobby.maxClientsPerIp}</span>
					</div>
				)
			})}
		</div >
	)
}

function JoinLobby() {
	const [lobbies, setLobbies] = useState([]);
	const refresh = () => {
		getLobbies().then(setLobbies)
	};
	useEffect(refresh, [])

	const [selectedLobby, setSelectedLobby] = useState(null);

	return (
		<div class="home-choice">
			<div style="display: flex; flex-direction: column; height: 100%">
				<div class="home-choice-title">Join Lobby</div>
				<button onClick={refresh}>Refresh</button>
				<LobbyList selectedLobby={selectedLobby} selectLobby={setSelectedLobby} lobbies={lobbies} />
			</div>
		</div>
	)
}

function CreateLobby() {
	const createLobby = (event) => {
		// Prevent page refresh
		event.preventDefault();

		// FIXME Use URL class
		const formData = new FormData(event.target);
		const data = [...formData.entries()];
		const query = data
			.map(x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1].toString())}`)
			.join('&');
		fetch('http://localhost:8080/v1/lobby?' + query, {
			method: 'POST',
		}).then((response) => {
			if (response.status === 200 || response.status === 201) {
				response.json().then((data) => {
					console.log(data);
					// FIXME Set usersession. Since we are on a different origin, we probs need
					// to provide a different way to provide the usersession, since a cookie won't work.
					window.location.href = 'http://localhost:8080/ssrEnterLobby/' + data.lobbyId;
				});
			}
		}).catch((error) => {
			console.error(error);
		});

		return true;
	};

	return (
		<div class="home-choice" >
			<div class="home-choice-title">Create Lobby</div>
			<form onSubmit={createLobby} id="lobby-create">
				<b>Language</b>
				<select class="input-item" name="language" placeholder="Choose your language">
					{/* FIXME Get languages from server */}
					<option value="english" selected>English (US)</option>
					<option value="english_gb" selected>English (GB)</option>
					<option value="german" selected>German</option>
				</select>
				<b>Drawing Time</b>
				<input class="input-item" type="number" name="drawing_time" min="60" max="300" value="120" />
				<b>Rounds</b>
				<input class="input-item" type="number" name="rounds" min="1" max="20" value="4" />
				<b>Max Players</b>
				<input class="input-item" type="number" name="max_players" min="2" max="24" value="12" />
				<b>Public</b>
				<input class="input-item" type="checkbox" name="public" value="true" checked />
				<b>Enable Votekick</b>
				<input class="input-item" type="checkbox" name="enable_votekick" value="true" checked />
				<b>Max Players per IP</b>
				<input class="input-item" type="number" name="clients_per_ip_limit" min="1" max="24" value="4" />
				<b>Custom Words Chance</b>
				<div class="input-item percent-slider">
					<span>0%</span>
					<input type="range" name="custom_words_chance" min="1" max="100" value="50" />
					<span>100%</span>
				</div>
				<b>Custom Words</b>
				<textarea class="input-item" name="custom_words" placeholder="Comma, separated, word, list, here"></textarea>
				<button target="lobby-create" type="submit" class="create-button">
					Create Lobby
				</button>
			</form>
		</div>
	)
}

export function Home() {
	return (
		<div class="home">
			< img id="logo" src={logo} alt="Scribble.rs logo" />

			<div id="create-or-join-container">
				<CreateLobby />
				<b id="create-or-join-container-or">OR</b>
				<JoinLobby />
			</div>
		</div >
	);
}

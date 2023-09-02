import { useEffect, useState, useRef } from 'preact/hooks';
import logo from '../../assets/logo.svg';
import clock from '../../assets/clock.svg';
import round from '../../assets/round.svg';
import user from '../../assets/user.svg';
import entrance from '../../assets/entrance.svg';
import './style.css';

function getLobbies() {
	return new Promise((resolve, reject) => {
		fetch('http://localhost:8080/v1/lobby').
			then((response) => {
				response.json().then(resolve);
			}).
			catch(reject);
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
	if (props.error) {
		return (
			<b>Error loading lobbies: {props.error.toString()}</b>
		);
	}

	if (props.lobbies && props.lobbies.length === 0) {
		return (
			<b>There are no lobbies yet.</b>
		);
	}

	return (
		<div id="lobby-list">
			{props.lobbies.map((lobby) => {
				return (
					<div
						title="Doubleclick to join lobby."
						onClick={() => props.selectLobby(lobby.lobbyId)}
						onDblClick={() => joinLobby(lobby.lobbyId)}
						class={props.selectedLobby !== lobby.lobbyId ? "lobby-list-item" : "lobby-list-item selected"} >

						{/* FIXME Replace words with iconography, saves us the
						 effort to translate and looks less cluttered. */}
						<span style="font-size: 2rem; text-shadow:-2px -2px 0 #AAAAAA, 2px -2px 0 #AAAAAA, -2px 2px 0 #AAAAAA, 2px 2px 0 #AAAAAA;">{languageToFlag(lobby.wordpack)}</span>

						<div class="lobby-list-item-info-pair">
							<img class="lobby-list-item-icon" src={user} />
							<span>{lobby.playerCount}/{lobby.maxPlayers}</span>
						</div>

						{props.selectedLobby === lobby.lobbyId ?
							<img src={entrance} style="align-self: center; 	width: 2em; height: 2em; grid-column: 4; grid-row: 1/3;" /> :
							<span style="width: 2em; height: 2em; grid-column: 4; grid-row: 1/3;" />}
						<div class="lobby-list-item-info-pair" style="grid-row: 2;" >
							<img class="lobby-list-item-icon" src={round} />
							<span>{lobby.round}/{lobby.rounds}</span>
						</div>
						<div class="lobby-list-item-info-pair" style="grid-row: 2">
							<img class="lobby-list-item-icon" src={clock} />
							<span>{lobby.drawingTime}</span>
						</div>
						<span style="grid-row: 2">Max Clients per IP {lobby.maxClientsPerIp}</span>
					</div>
				)
			})}
		</div >
	)
}

function JoinLobby() {
	const [lobbies, setLobbies] = useState([]);
	const [error, setError] = useState(null);
	const refresh = () => {
		getLobbies().then((data) => {
			setError(null);
			setLobbies(data);
		}).catch((err) => {
			setError(err);
		});
	};
	useEffect(refresh, []);

	const [selectedLobby, setSelectedLobby] = useState(null);

	return (
		<div class="home-choice">
			<div class="home-choice-inner">
				<div class="home-choice-title">Join Lobby</div>
				<button onClick={refresh}>Refresh</button>
				<LobbyList error={error} selectedLobby={selectedLobby} selectLobby={setSelectedLobby} lobbies={lobbies} />
			</div>
		</div>
	)
}

function joinLobby(lobbyId) {
	window.location.href = 'http://localhost:8080/ssrEnterLobby/' + lobbyId;
}

function NumberInput(props) {
	const input = useRef(null);
	const stepDown = () => input.current && input.current.stepDown();
	const stepUp = () => input.current && input.current.stepUp();

	return (
		<div class="custom-number-wrapper">
			<button class="number-decrement" onClick={stepDown} type="button">-</button>
			<input ref={input} type="number" name={props.name}
				min={props.min} max={props.max} value={props.value} />
			<button class="number-increment" onClick={stepUp} type="button">+</button>
		</div >
	)
}

function CreateLobby() {
	const createLobby = (event) => {
		// Prevent page refresh
		event.preventDefault();

		const formData = new FormData(event.target);
		const data = [...formData.entries()];
		let query = data
			.map(x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1].toString())}`)
			.join('&');
		if (event.submitter.id === "create-public") {
			query += "&public=true";
		}

		fetch('http://localhost:8080/v1/lobby?' + query, {
			credentials: 'include',
			method: 'POST',
		}).then((response) => {
			if (response.status === 200 || response.status === 201) {
				response.json().then((data) => {
					joinLobby(data.lobbyId);
				});
			}
		}).catch((error) => {
			console.error(error);
		});

		return true;
	};

	return (
		<div class="home-choice" >
			<div class="home-choice-inner">
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
					<NumberInput type="number" name="drawing_time" min="60" max="300" value="120" />
					<b>Rounds</b>
					<NumberInput type="number" name="rounds" min="1" max="20" value="4" />
					<b>Max Players</b>
					<NumberInput type="number" name="max_players" min="2" max="24" value="12" />
					<b>Max Players per IP</b>
					<NumberInput type="number" name="clients_per_ip_limit" min="1" max="24" value="4" />
					<b>Custom Words Per Turn</b>
					<NumberInput name="custom_words_per_turn" min="1" max="3" value="3" />
					<b>Custom Words</b>
					<textarea class="input-item" name="custom_words" placeholder="Comma, separated, word, list, here"></textarea>
				</form>
				<div style="display: flex; flex-direction: row; gap: 0.5rem;">
					<button id="create-public" form="lobby-create" type="submit" class="create-button">
						Create Public Lobby
					</button>
					<button form="lobby-create" type="submit" class="create-button">
						Create Private Lobby
					</button>
				</div>
			</div>
		</div >
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

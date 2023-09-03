import { useEffect, useState } from 'preact/hooks';
import clock from '../../../assets/clock.svg';
import round from '../../../assets/round.svg';
import user from '../../../assets/user.svg';
import entrance from '../../../assets/entrance.svg';
import './join.css';
import { ReloadSpinner } from '../../../components/ReloadSpinner/spinner';


function getLobbies() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:8080/v1/lobby').
            then((response) => {
                response.json().then(resolve);
            }).
            catch(reject);
    })
}

export function JoinLobby(props) {
    const [lobbies, setLobbies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const refresh = () => {
        setLoading(true);
        getLobbies().then((data) => {
            setError(null);
            setLobbies(data);
        }).catch((err) => {
            setError(err);
        }).finally(() => {
            setLoading(false);
        });
    };
    useEffect(refresh, []);

    const [selectedLobby, setSelectedLobby] = useState(null);

    return (
        <div class="home-choice">
            <div class="home-choice-inner">
                <div class="home-choice-header">
                    <div class="home-choice-title">Join Lobby</div>
                    <button onClick={refresh}>Refresh</button>
                </div>
                <LobbyList error={error} loading={loading} selectedLobby={selectedLobby} selectLobby={setSelectedLobby} lobbies={lobbies} />
            </div>
        </div>
    )
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
    if (props.loading) {
        return (
            <div class="lobby-list-placeholder">
                <ReloadSpinner />
            </div>
        );
    };

    if (props.error) {
        return (
            <div class="lobby-list-placeholder">
                <b>Error loading lobbies: {props.error.toString()}</b>
            </div>
        );
    }

    if (props.lobbies && props.lobbies.length === 0) {
        return (
            <div class="lobby-list-placeholder">
                <b>There are no lobbies yet.</b>
            </div>
        );
    }

    return (
        <div id="lobby-list">
            {props.lobbies.map((lobby) => {
                return (
                    <div
                        title="Doubleclick to join lobby."
                        onClick={() => props.selectLobby(lobby.lobbyId)}
                        onDblClick={() => props.joinLobby(lobby.lobbyId)}
                        class={props.selectedLobby !== lobby.lobbyId ? "lobby-list-item" : "lobby-list-item selected"} >

                        <div class="lobby-list-rows">
                            <div style="display: flex; align-items: center; gap:0.5rem">
                                <span class="language-flag">{languageToFlag(lobby.wordpack)}</span>
                                {lobby.customWords ? <span class="custom-tag">Custom</span> : null}
                            </div>

                            <div class="lobby-list-item-info-pair">
                                <img class="lobby-list-item-icon" src={user} />
                                <span>{lobby.playerCount}/{lobby.maxPlayers}</span>
                            </div>
                            <div class="lobby-list-item-info-pair" style="grid-row: 2;" >
                                <img class="lobby-list-item-icon" src={round} />
                                <span>{lobby.round}/{lobby.rounds}</span>
                            </div>
                            <div class="lobby-list-item-info-pair" style="grid-row: 2">
                                <img class="lobby-list-item-icon" src={clock} />
                                <span>{lobby.drawingTime}</span>
                            </div>
                        </div>
                        {/* FIXME Replace words with iconography, saves us the
						 effort to translate and looks less cluttered. */}
                        {props.selectedLobby === lobby.lobbyId ?
                            <img src={entrance} style="align-self: center; 	width: 2em; height: 2em;" /> :
                            <span style="width: 2em; height: 2em;" />}
                    </div>
                )
            })}
        </div >
    )
}
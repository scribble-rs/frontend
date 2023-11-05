import { useEffect, useState } from 'preact/hooks';
import clockIcon from '../../../assets/clock.svg';
import roundIcon from '../../../assets/round.svg';
import userIcon from '../../../assets/user.svg';
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

export function LobbyChooser(props) {
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

    return (
        <div class="home-choice">
            <div class="home-choice-inner">
                <div class="home-choice-header">
                    <div class="home-choice-title">Join Lobby</div>
                    <button onClick={refresh}>Refresh</button>
                </div>
                <LobbyList
                    joinLobby={props.joinLobby}
                    error={error}
                    loading={loading}
                    lobbies={lobbies} />
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

function removeLoading(event) {
    event.target.classList.remove("loading");
}

function LobbyListIcon(props) {
    return <img class="lobby-list-item-icon loading" src={props.src} loading={"lazy"} onLoad={removeLoading} />
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
                const joinClickedLobby = () => {
                    props.joinLobby(lobby.lobbyId);
                };
                return (
                    <div
                        title="Doubleclick to join lobby."
                        onClick={() => props.selectLobby(lobby.lobbyId)}
                        onDblClick={joinClickedLobby}
                        class={"lobby-list-item"} >

                        <div class="lobby-list-rows">
                            <div class="lobby-list-row">
                                <span class="language-flag">{languageToFlag(lobby.wordpack)}</span>
                                {lobby.customWords ? <span class="custom-tag">Custom Words</span> : null}
                                {lobby.state === "ongoing"
                                    ? <span class="custom-tag">Ongoing</span>
                                    : lobby.state === "gameOver"
                                        ? <span class="custom-tag">Game Over</span>
                                        : null}
                            </div>

                            <div class="lobby-list-row">
                                <div class="lobby-list-item-info-pair">
                                    <LobbyListIcon src={userIcon} />
                                    <span>{lobby.playerCount}/{lobby.maxPlayers}</span>
                                </div>
                                <div class="lobby-list-item-info-pair" style="grid-row: 2;" >
                                    <LobbyListIcon src={roundIcon} />
                                    <span>{lobby.round}/{lobby.rounds}</span>
                                </div>
                                <div class="lobby-list-item-info-pair" style="grid-row: 2">
                                    <LobbyListIcon src={clockIcon} />
                                    <span>{lobby.drawingTime}</span>
                                </div>
                            </div>
                        </div>

                        <button onClick={joinClickedLobby} class="join-button">Join</button>
                    </div>
                )
            })}
        </div >
    )
}
// import { FormEvent, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { database } from '../services/firebase';

// import { useAuth } from '../hooks/useAuth';
// import { database } from '../services/firebase';

import { RoomCode } from '../components/RoomCode';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import '../styles/room.scss';

type RoomParams = {
  id: string;
};

export default function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleEndRoom() {
    if (window.confirm('Tem certeza que deseja encerrar esta sala?')) {
      await database.ref(`rooms/${roomId}`).update({ endedAt: new Date() });

      history.push('/');
    }
  }

  return (
    <>
      <div id="page-room">
        <header>
          <div className="content">
            <img src={logoImg} alt="Letmeask logo" />
            <div>
              <RoomCode code={roomId} />
              <Button isOutlined onClick={handleEndRoom}>
                Encerrar sala
              </Button>
            </div>
          </div>
        </header>

        <main>
          <div className="room-title">
            <h1>Sala {title}</h1>
            {questions.length > 0 && (
              <span>{questions.length} pergunta(s)</span>
            )}
          </div>

          <div className="question-list">
            {questions.map(
              ({ id, content, author, isAnswered, isHighlighted }, index) => {
                return (
                  <Question
                    key={id}
                    content={content}
                    author={author}
                    isAnswered={isAnswered}
                    isHighlighted={isHighlighted}
                  >
                    {!isAnswered && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCheckQuestionAsAnswered(id)}
                        >
                          <img
                            src={checkImg}
                            alt="Marcar pergunta como respondida"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleHighlightQuestion(id)}
                        >
                          <img
                            src={answerImg}
                            alt="Dar destaque à pergunta respondida"
                          />
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(id)}
                    >
                      <img src={deleteImg} alt="delete question" />
                    </button>
                  </Question>
                );
              }
            )}
          </div>
        </main>
      </div>
    </>
  );
}

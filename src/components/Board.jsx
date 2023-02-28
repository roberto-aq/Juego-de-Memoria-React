import React, { useEffect, useState } from 'react';
import { imgs } from '../data';
import { Card } from './Card';
import { Modal } from './Modal';

const shuffleArray = array => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

export const Board = () => {
	const [cards, setCards] = useState([]);
	const [flippedCards, setFlippedCards] = useState([]);
	const [moves, setMoves] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);

	const createBoard = () => {
		const duplicatecards = imgs.flatMap((img, i) => {
			const duplicate = {
				...img,
				id: img.id + imgs.length,
			};
			return [img, duplicate];
		});

		const newCards = shuffleArray(duplicatecards);
		const cards = newCards.map(card => {
			return {
				...card,
				flipped: false,
				matched: false,
			};
		});
		setCards(cards);
	};

	useEffect(() => {
		createBoard();
	}, []);

	const handleCardClick = id => {
		if (isDisabled) return;

		const [currentCard] = cards.filter(card => card.id === id);

		if (!currentCard.flipped && !currentCard.matched) {
			currentCard.flipped = true;

			const newFlippedCards = [...flippedCards, currentCard];
			setFlippedCards(newFlippedCards);

			if (newFlippedCards.length === 2) {
				setIsDisabled(true);
				const [firstCard, secondCard] = newFlippedCards;

				if (firstCard.img === secondCard.img) {
					firstCard.matched = true;
					secondCard.matched = true;
					setIsDisabled(false);
				} else {
					setTimeout(() => {
						firstCard.flipped = false;
						secondCard.flipped = false;
						setCards(cards);
						setIsDisabled(false);
					}, 1000);
				}

				setFlippedCards([]);
				setMoves(moves + 1);
			}

			setCards(cards);
		}

		if (cards.every(card => card.matched)) {
			setGameOver(true);
			setIsDisabled(true);
		}
	};

	const handleNewGame = () => {
		setCards([]);
		createBoard();
		setMoves(0);
		setGameOver(false);
		setIsDisabled(false);
	};

	return (
		<>
			{gameOver && (
				<div className='fixed inset-0 bg-black opacity-50 z-10'></div>
			)}

			<div className='relative h-screen flex items-center'>
				<div className='mx-auto flex flex-col justify-center items-center'>
					<h1 className='font-bold text-4xl my-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 md:text-5xl'>
						Memory Game
					</h1>
					<div className='grid grid-cols-4 gap-3 justify-center items-center px-3 py-5 my-3'>
						{cards.map(card => (
							<Card
								card={card}
								key={card.id}
								handleCardClick={handleCardClick}
							/>
						))}
					</div>
					<button
						className='bg-black font-semibold text-white rounded-md px-5 py-1 hover:bg-yellow-500 hover:text-black transition-all mb-3'
						onClick={handleNewGame}
					>
						Nuevo Juego
					</button>
				</div>

				<Modal
					gameOver={gameOver}
					setGameOver={setGameOver}
					moves={moves}
					handleNewGame={handleNewGame}
				/>
			</div>
		</>
	);
};

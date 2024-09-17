import "./App.css";
import React, { useState } from "react";

export default function Highlow() {
  //トランプを表示する変数を作る
  const suits = ["❤", "♦", "♣", "♠"];
  const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const cards = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      cards.push({ suit: suit, rank: rank });
    }
  }

  const [card, setCard] = useState(null); //出た自分のカードを保存する変数
  const [anotherCard, setAnotherCard] = useState(null); //相手の出た目を保存する変数
  const [selectedCards, setSelectedCards] = useState(new Set()); //出たカードのインデックス番号を保存
  const [resultHistory, setResultHistory] = useState([0, 0, 0]); //結果の履歴を保存する変数
  const [result, setResult] = useState(""); //結果を表示する変数
  const [gameFinish, setGamefinish] = useState(true); //ゲームをオンとオフの状態にする

  //山札が減った状態で次の勝負に行く関数を作る(山札)
  const declare = () => {
    if (!gameFinish) return; //勝負が終わってなかったら作用しない
    const randomIndex = Math.floor(Math.random() * cards.length); //ボタンを押したらその山札から一枚とって表にする関数を作る
    if (selectedCards.has(randomIndex)) return; //同じインデックス番号はリターン
    setSelectedCards((prev) => new Set(prev).add(randomIndex)); //重複を避けるためにインデックス番号を保存
    setCard(cards[randomIndex]); //選ばれた数字がcardにセットされる
  };

  const nextgame = () => {
    setGamefinish(true);
    setResult("");
    setAnotherCard(null);
    setCard(null);
  };

  const drawCard = (guess) => {
    if (card === null || !gameFinish) return;
    const randomIndex = Math.floor(Math.random() * cards.length); //クリックしたらカードがめくれる関数を作る
    if (selectedCards.has(randomIndex)) return; //同じインデックス番号はリターン
    setSelectedCards((prev) => new Set(prev).add(randomIndex)); //重複を避けるためにインデックス番号を保存
    const drawnCard = cards[randomIndex]
    setAnotherCard(drawnCard); //選ばれた数字がanothercardにセットされる

    if (card && drawnCard) {
      if (guess === "high" && card.rank > drawnCard.rank) {
        //自分のカードと相手のカードを比べかつhighlow予想が当たっているのかでwinとloseの結果を表する
        setResult("You win");
        updateResult(0);
      } else if (guess === "low" && card.rank < drawnCard.rank) {
        setResult("You win");
        updateResult(0);
      } else if (card.rank === drawnCard.rank) {
        setResult("draw");
        updateResult(2);
      } else {
        setResult("You lose");
        updateResult(1);
      }
      setGamefinish(false);
    }
  };

  //ボタンを押すとリセットされる関数を作る
  const clear = () => {
    setSelectedCards(new Set()); //保存していたインデックス番号を初期値に戻す
    setCard(null); //自分のカードを初期値に戻す
    setAnotherCard(null); //相手のカードを初期値戻す
    setResult(""); //結果を非表示にする
    setResultHistory([0, 0, 0]); //結果の履歴をリセットする
    setGamefinish(true);
  };

  //win,lose,drawの結果の数を表示する関数を作る
  //勝負が行われたときに新しい配列を作る
  const updateResult = (index) => {
    setResultHistory((prevHistory) => {
      const newHistory = [...prevHistory]; // 配列をコピー
      newHistory[index] += 1; // 指定されたインデックスの値を1増やす
      return newHistory; // 更新された配列を返す
    });
  };

  return (
    <div>
      {/* <button onClick={declare}>山札</button> */}
      <p>
        相手のカード:
        {anotherCard
          ? `${anotherCard.suit} ${anotherCard.rank}`
          : "highかlowかを選んでください"}
      </p>
      <button onClick={() => drawCard("high")}>high</button>
      <p>or</p>
      <button onClick={() => drawCard("low")}>low</button>
      <p>{result}</p>
      <button onClick={declare}>山札</button>
      <p>
        あなたのカード:{card ? `${card.suit} ${card.rank}` : "山札をタップ"}
      </p>
      <button onClick={nextgame}>次の勝負</button>
      <button onClick={clear}>初めから</button>
      <p>勝ち: {resultHistory[0]}</p>
      <p>負け: {resultHistory[1]}</p>
      <p>引き分け: {resultHistory[2]}</p>
    </div>
  );
}

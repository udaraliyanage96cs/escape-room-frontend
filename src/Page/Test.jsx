import React, { useState } from "react";

const SiblingOne = ({ onClick }) => {
  const handleClick = () => {
    onClick();
  };

  return <button onClick={handleClick}>Click me</button>;
};

const SiblingTwo = () => {
  const handleButtonClick = () => {
    console.log("Button clicked");
  };

  return <div>Sibling Two</div>;
};

const Test = () => {
  const [state, setState] = useState(false);

  const handleSiblingOneClick = () => {
    setState(true);
  };

  return (
    <>
      <SiblingOne onClick={handleSiblingOneClick} />
      {state && <SiblingTwo />}
    </>
  );
};

export default Test;

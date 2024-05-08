import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.a`
  width: 210px;
  height: 210px;
  background-color: #fff;
  text-align: center;
  line-height: 330px;
  font-size: 35px;
  display: block;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  border: 3px solid #fff;
  z-index: 1;
  cursor: pointer;
  transition: all 0.5s ease;

  .icon {
    position: relative;
    color: ${(props) => props.color || '#262626'};
    transition: all 0.5s ease;
    z-index: 3;
  }

  .text {
    position: absolute;
    bottom: 10px; /* Adjust position as needed */
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    font-size: 26px;
    color: ${(props) => props.color || '#262626'};
    z-index: 3;
    transition: all 0.5s ease; /* Add transition */
  }

  &:hover {
    .icon {
      color: #fff;
      transform: scale(1.5) rotate(20deg);
    }

    .text { /* Apply effect on hover */
      color: #fff; /* Change text color */
      transform: translateY(-10px); /* Move text up */
      transform: translateX(-50%);
    }

    &:before {
      bottom: 0; /* Change direction to top */
    }
  }

  &:before {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${(props) => props.color || '#f00'}; /* Change background color */
    transition: all 0.8s ease;
    z-index: 2;
  }
`;

const SocialButton = ({ logo: icon, color, link, text }) => {
  return (
    <StyledButton color={color} href={link} target='_blank' rel="noreferrer">
      <i style={{ marginBottom: "200px" }} className={`icon ${icon}`} >
        {icon}
      </i>
      <span className="text">{text}</span>
    </StyledButton>
  );
};

export default SocialButton;

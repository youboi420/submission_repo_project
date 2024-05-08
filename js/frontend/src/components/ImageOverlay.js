import React from 'react';
import { Typography } from '@mui/material';
import styled from 'styled-components';

const StyledFigure = styled.figure`
    font-family: Raleway, Arial, sans-serif;
    position: relative;
    text-align: center;
    transition: all 0.75s;

    &:hover img {
      transform: scale(1.18);
      filter: brightness(0.5);
    }

    &:hover h4 {
      opacity: 1;
      transform: translate3d(0%, 0%, 0);
    }

    &:hover div:before {
      background: rgba(255, 255, 255, 0);
      left: 30px;
      opacity: 1;
      transition-delay: 0s;
    }
`;

const StyledImage = styled.img`
  width: 150px; /* Adjust as desired */
  height: 150px; /* Adjust as desired */
  box-sizing: border-box;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.55s, filter 1.5s;  /* Specify durations */
`;

const StyledBefore = styled.div`
    position: absolute;
    top: 30px;
    right: 30px;
    bottom: 30px;
    left: 100%;
    border-left: 4px solid rgba(255, 255, 255, 0.8);
    content: '';
    opacity: 0;
    background-color: rgba(255, 255, 255, 0.5);
    transition: all 0.5s;
    transition-delay: 0.6s;
`;

const StyledHeading = styled(Typography)`
    opacity: 0;
    transition: opacity 0.35s, transform 0.35s;
    word-spacing: -0.15em;
    font-weight: 300;
    margin-top: calc(20%);
    transform: translate3d(30%, 0%, 0);
`;

const StyledSubheading = styled(Typography)`
    margin: 0 0 5px;
    opacity: 0;
    transition: opacity 0.35s, transform 0.35s;
    font-weight: 200;
    transform: translate3d(0%, 30%, 0);
    transition-delay: 0s;
`;

const StyledAnchor = styled.a`
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: absolute;
`;

const ImageWithOverlay = ({ imageUrl, heading, subheading, linkUrl }) => {
  return (
    <div style={{height: "150px", width: "150px"}}>
      <StyledFigure>
        <StyledImage src={imageUrl} alt="Image" />
          <StyledHeading variant="h4">{heading}</StyledHeading>
          <StyledSubheading variant="body1">{subheading}</StyledSubheading>
          <StyledAnchor href={linkUrl} target='_blank' rel="noreferrer" />
        <StyledBefore />
      </StyledFigure>
    </div>
  );
};

export default ImageWithOverlay;

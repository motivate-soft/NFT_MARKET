import React, { useState, useEffect } from "react"
import { SiBinance } from "react-icons/si"
import { ColorExtractor } from 'react-color-extractor'
import ReactPlayer from "react-player"
import Card from "./base/Card"
import Button from "./base/Button"
import { Colors } from "../constants/Colors"
import "../styles/NFTCard.css"

const imageFileFormats = ['png', 'jpg', 'gif', 'svg']
const mediaFileFormats = ['mp4', 'webm', 'mp3', 'wav', 'ogg']
const threeDFileFormats = ['glb', 'gltf']

const NFTCard = ({ nftName, price, nftSrc, onClick, mode, onResetClick }) => {
  const [colors, setColors] = useState([])
  const [type, setType] = useState(null)
  const getColors = colors => {
    setColors(c => [...c, ...colors])
  }

  const getParameterByName = (name, url) => {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }

  const get_url_extension = (url) => {
    const extension = url.split(/[#?]/)[0].split('.').pop().trim()
    return extension.toLowerCase()
  }

  useEffect(() => {
    if (nftSrc.indexOf('ipfs') !== -1) {
      const res = getParameterByName('type', nftSrc)
      if (res === null) return
      setType(Number(res))
    } else {
      const ext = get_url_extension(nftSrc)
      const typetemp = imageFileFormats.indexOf(ext) !== -1 ? 1 : mediaFileFormats.indexOf(ext) !== -1 ? 2 : threeDFileFormats.indexOf(ext) !== -1 ? 3 : 0
      setType(typetemp)
    }
  }, [nftSrc])

  return (
    <Card
      blurColor={colors[type ? type : 0]}
      child={
        <>
          {type === 1 ?
            <ColorExtractor getColors={getColors}>
              <img className="nft-image" src={nftSrc} alt="MFT" />
            </ColorExtractor>
            : type === 2 ?
              <ReactPlayer
                width={240}
                height={170}
                url={nftSrc}
                controls
              />
              : type === 3 ?
                <div className="nft-3d-wrapper">
                  <model-viewer
                    className="nft-3d"
                    ar-scale="auto"
                    ar ar-modes="webxr scene-viewer quick-look"
                    loading="eager"
                    camera-controls auto-rotate src={nftSrc} ></model-viewer>
                </div>
                : <div></div>
          }
          <div className="wrapper">
            <div className="info-container">
              <p className="owner">Name</p>
              <p className="name">{nftName}</p>
            </div>

            <div className="price-container">
              <p className="price-label">Price</p>
              <p className="price">
                {" "}
                <SiBinance size="13px" /> {price}
              </p>
            </div>
          </div>
          <div className="buttons">
            <Button color={Colors.buttons.primary} textContent={mode === 2 ? "Sell" : mode === 1 ? "Buy Now" : "Delist"} onClick={onClick} />
            {mode === 3 && <>&nbsp;&nbsp;<Button color={Colors.buttons.primary} textContent={"Reset Price"} onClick={onResetClick} /></>}
          </div>
        </>}>
    </Card>
  )
}

export default NFTCard
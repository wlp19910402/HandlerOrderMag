import { Row, Col, Image } from 'antd';
import React from 'react';
interface ImageFlatDataProps {
  imageUrls?: string[];
}
const ImageFlat: React.FC<ImageFlatDataProps> = ({ imageUrls }) => {
  return (
    imageUrls && imageUrls.length > 0 ?
      (
        <Row gutter={ [ 16, 16 ] } >
          { imageUrls.map((url: string, index: number) =>
            <Col key={ index }>
              <Image
                width="60px" height="60px"
                src={ `${url}?x-oss-process=image/resize,h_100,w_100,m_lfit` }
                preview={ { src: url } }
              />
            </Col>
          ) }</Row>
      ) : <span style={ { color: "#999999" } }>暂无图片</span>
  )
};

export default ImageFlat
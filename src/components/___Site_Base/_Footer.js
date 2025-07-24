import React, { Fragment } from 'react'

const Footer = () => {

     return (
          <Fragment>
               <footer
                    style={{
                         backgroundColor: '#eceff1',
                         textAlign: 'center',
                         padding: '16px',
                         // marginTop: '40px',

                         minHeight: 120,
                         display: 'flex',
                         justifyContent: 'center',
                         alignItems: 'center',

                         backgroundImage: `url(${process.env.PUBLIC_URL}/FooterBG.png)`,
                         backgroundSize: '250px',         // Scale image to 23% of container
                         backgroundPosition: 'center',  // Centre the image
                         backgroundRepeat: 'repeat', // Do not repeat the image

                         borderTop: '0.3px solid #DEE0E3'
                    }}>

                    <p
                         style={{
                              margin: 0,
                              color: '#546e7a',
                              fontSize: 12,
                              textShadow: '0 0 6px #eceff1',
                              boxShadow: '0 0 6px #eceff1',
                              background: '#eceff144'
                         }}
                    >
                         © 2025 The Events App. All rights reserved.
                    </p>

               </footer>
          </Fragment>
     )
}

export default Footer
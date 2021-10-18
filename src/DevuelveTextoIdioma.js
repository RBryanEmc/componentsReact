import React, {Fragment } from 'react'
import { useTranslation } from 'react-i18next'


function DevuelveTextoIdioma(props) {
  const { t, i18n } = useTranslation(props.fichero)
  return  (
  
        <Fragment>
          {t(props.texto)}
          </Fragment>
        
          )
}


export default DevuelveTextoIdioma


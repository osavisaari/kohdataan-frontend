import React from 'react'
import ShadowBox from '../../ShadowBox'
import InputField from '../../InputField'
import './styles.scss'

const index = () => {
  return (
    <ShadowBox>
      <div className="add-user-nickname-container">
        <h3 className="add-user-nickname-title">Kerro kuka olet</h3>
        <InputField
          inputClassName="add-user-nickname-text"
          labelClassName="add-user-nickname-field"
          label="Kutsumanimi"
        />
        <p className="add-user-nickname-title">Tämä nimi näkyy muille</p>
      </div>
    </ShadowBox>
  )
}

export default index
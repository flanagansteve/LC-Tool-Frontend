import React, { useEffect, useState } from 'react';
import { Prompt, useHistory } from 'react-router-dom';
import {Modal} from './Modal';

export const RouteBlockingModal = ({when}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [lastLocation, setLastLocation] = useState(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const history = useHistory();

  const closeModal = () => {
    setModalVisible(false);
  };
  const handleBlockedNavigation = (nextLocation) => {
    if (!confirmedNavigation) {
      setModalVisible(true);
      setLastLocation(nextLocation);
      return false;
    }
    return true;
  };

  const handleConfirmNavigationClick = () => {
    setModalVisible(false);
    setConfirmedNavigation(true);
  };

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      // Navigate to the previous blocked location with your navigate function
      history.push(lastLocation.pathname);
    }
  }, [confirmedNavigation, lastLocation]);

  return (
      <div>
        <Prompt when={when} message={handleBlockedNavigation}/>
        <Modal
            show={modalVisible}
            title="Exit without saving?"
            selectButton="Confirm"
            cancelButton={"Dismiss"}
            onCancel={closeModal}
            onSelect={handleConfirmNavigationClick}>
          <div style={{paddingBottom: 15}}>You have unsaved changes. Are you sure you want to leave without saving?</div>
        </Modal>
      </div>
  );
};

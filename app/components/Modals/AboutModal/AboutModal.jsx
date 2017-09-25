import React from 'react';
import ModalDialog from '@atlaskit/modal-dialog';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { bindActionCreators } from 'redux';

import * as uiActions from '../../../actions/ui';

import Flex from '../../../components/Base/Flex/Flex';
import {} from './styled';
// import {
//   H100, H200, H300, H400, H500, H600, H700, H800,
//   Link,
// } from '../../../styles/typography';
import { Button } from '../../../styles/buttons';

// eslint-disable-next-line
const AboutModal = ({ isOpen, setShowAboutModal, ...props }) => (
  <ModalDialog
    isOpen={isOpen}
    onClose={() => setShowAboutModal(false)}
    onDialogDismissed={() => setShowAboutModal(false)}
  >
    <Flex column alignCenter style={{ margin: '20px 0px' }}>
      <Button
        style={{ marginBottom: 18, width: 400 }}
        onClick={() => ipcRenderer.send('showIdlePopup')}
      >
        Display Idle Popup
      </Button>
      <Button
        style={{ marginBottom: 18, width: 400 }}
        onClick={() => ipcRenderer.send('showScreenPreviewPopup')}
      >
        Display ScreenshotPopup Popup
      </Button>
      <Button
        style={{ width: 400 }}
        onClick={() => props.setShowAlertModal(true)}
      >
        Display Alert Modal
      </Button>
    </Flex>
  </ModalDialog>
);

function mapStateToProps({ ui }) {
  return {
    isOpen: ui.showAboutModal,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutModal);

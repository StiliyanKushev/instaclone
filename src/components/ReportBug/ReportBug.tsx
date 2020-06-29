import React from 'react';
import { Dimmer, Segment, Header, TextArea, Button, Icon } from 'semantic-ui-react';

import styles from './ReportBug.module.css';

interface IProps {
    handleClose: Function
}

class ReportBug extends React.Component<IProps> {
    render() {
        return (
            <Dimmer active>
                <Segment size='tiny'>
                    <Icon onClick={this.props.handleClose} className={styles.closeIcon} color='black' size='big' name='close'></Icon>
                    <Header className={styles.header} size='large'>Report a bug</Header>
                    <TextArea rows='8' className={styles.textArea}></TextArea>
                    <br/>
                    <Button fluid primary>Send Report</Button>
                    <br/>
                    <Header disabled size='tiny' as='span'>Your instaclone username and browser information will be automatically included in the report.</Header>
                </Segment>
            </Dimmer>
        );
    }
}

export default ReportBug;
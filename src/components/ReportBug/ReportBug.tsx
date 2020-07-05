// IMPORT STYLES
import styles from './ReportBug.module.css';

// IMPORT REACT RELETED
import React from 'react';
import { Dimmer, Segment, Header, TextArea, Button, Icon } from 'semantic-ui-react';

// IMPORT OTHER
import { reportBug } from '../../handlers/mail';
import { toast } from 'react-toastify';

interface IProps {
    handleClose: Function
}

class ReportBug extends React.Component<IProps> {
    state = {report:''}

    private handleSendReport(){
        reportBug(this.state.report).then(res => {
            if(res.success){
                toast.success(res.messege);
            }
            else{
                toast.error(res.messege);
            }
            this.props.handleClose();
        });
    }

    public render() {
        return (
            <Dimmer active>
                <Segment size='tiny'>
                    <Icon onClick={this.props.handleClose} className={styles.closeIcon} color='black' size='big' name='close'></Icon>
                    <Header className={styles.header} size='large'>Report a bug</Header>
                    <TextArea onChange={e => this.setState({report:e.currentTarget.value})} rows='8' className={styles.textArea}></TextArea>
                    <br/>
                    <Button onClick={this.handleSendReport.bind(this)} fluid primary>Send Report</Button>
                    <br/>
                    <Header disabled size='tiny' as='span'>Your instaclone username and browser information will be automatically included in the report.</Header>
                </Segment>
            </Dimmer>
        );
    }
}

export default ReportBug;
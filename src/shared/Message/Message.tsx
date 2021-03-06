// IMPORT STYLES
import styles from './Message.module.css';

// IMPORT REACT RELATED
import React from 'react';
import { Header } from 'semantic-ui-react';

// IMPORT VALIDATION
import { IMessage } from '../../types/response';

interface IParentProps {
    currentRow: IMessage,
    authUsername: string,
    measure: () => void,
}

type IProps = IParentProps;

class Message extends React.PureComponent<IProps, any>{
    public componentDidMount(){
        this.props.measure();
    }

    public componentDidUpdate(){
        this.props.measure();
    }

    public render() {
        let currentRow = this.props.currentRow;

        if (currentRow) {
            return (
                <>
                    {
                        currentRow.user.toLowerCase() === this.props.authUsername.toLowerCase() ? (
                            <>
                                <Header className={styles.headerRight} block size='medium'>{currentRow.text}</Header>
                            </>
                        ) :
                            (
                                <>
                                    <Header className={styles.headerUsername} size='tiny'>{currentRow.user}</Header>
                                    <Header className={styles.headerLeft} block size='medium'>{currentRow.text}</Header>
                                </>
                            )
                    }
                </>
            )
        }

        return (<></>);
    }
}

export default Message;
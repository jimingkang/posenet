import * as React from 'react';
import { Peer, Room } from '../Definitions';
export interface CommandEvent {
    room: Room;
    peer: Peer;
    type: string;
    data: any;
}
export interface CustomCommandProps {
    room: string;
    signalingClient?: any;
    sendRoomCommand?: (datatype: string, data?: any) => void;
    sendPeerCommand?: (peerAddress: string, datatype: string, data?: any) => void;
    onRoomCommand?: (event: CommandEvent) => void;
    onPeerCommand?: (event: CommandEvent) => void;
    render?: (props: CustomCommandRenderProps) => React.ReactNode;
    children?: React.ReactNode | ((props: CustomCommandRenderProps) => React.ReactNode);
}
export interface CustomCommandRenderProps {
    sendRoomCommand: (datatype: string, data?: any) => void;
    sendPeerCommand: (peerAddress: string, datatype: string, data?: any) => void;
}
/**
 * @description
 *
 * @public
 */
declare class CustomCommands extends React.Component<CustomCommandProps, any> {
    private commandHandler;
    constructor(props: CustomCommandProps);
    render(): {} | null | undefined;
    componentDidMount(): void;
    componentDidUpdate(prev: CustomCommandProps): void;
    componentWillUnmount(): void;
}
declare const _default: import("react-redux").ConnectedComponent<typeof CustomCommands, Pick<React.ClassAttributes<CustomCommands> & CustomCommandProps, "key" | "ref"> & CustomCommandProps>;
export default _default;

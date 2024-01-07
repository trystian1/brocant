import { ReactNode } from "react";

const styles = {
    marginLeft: '2em',
    marginRight: 'auto'
}

export const Wrapper = ({ children }: {children: ReactNode}) => {
    return <div style={{...styles}}>
        {children}
    </div>
}
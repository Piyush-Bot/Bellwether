
const PrimaryContainer = (props) => {
    return (
        <div className="content">
            <div className="container-fluid">
                {props.children}
            </div>
        </div>
    )
}

export default PrimaryContainer;
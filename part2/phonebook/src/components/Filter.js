
const Filter = ({ filter, filterHandler }) => (
    <div>
        filter show with : <input value={filter} onChange={filterHandler} />
    </div>
)

export default Filter
const Persons = ({ persons, filter, deleteHandler }) => (
    <div>{persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase())).map((per) => <div key={per.name}>{per.name} {per.number} <button onClick={() => deleteHandler(per.id, per.name)}>delete</button></div>)}</div>
)
export default Persons
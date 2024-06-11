// import {Dataset} from "../types/database"




// function SearchByName({ filteredPersons }) {
//     const filtered = filteredPersons.map(person =>  <Card key={person.id} person={person} />); 
//     return (
//       <div>
//         {filtered}
//       </div>
//     );
//   }


  
// export default SearchByName;



// const sortFunctions: sortOptions = {
//   name: {
//     func: (a: [string, Dataset], b: [string, Dataset]) =>
//       a[1].name.localeCompare(b[1].name, undefined, {
//         numeric: true,
//         sensitivity: "base"
//       }),
//     title: "Dataset Name"
//   },
//   size: {
//     func: (a: [string, Dataset], b: [string, Dataset]) =>
//       [...b[1].images.keys()].length - [...a[1].images.keys()].length,
//     title: "Dataset Size"
//   },
//   collected: {
//     func: (a: [string, Dataset], b: [string, Dataset]) =>
//       new Date(b[1].imageAcquisition!.startDate!).getTime() -
//       new Date(a[1].imageAcquisition!.startDate!).getTime(),
//     title: "Date Collected"
//   },
//   added: {
//     func: (a: [string, Dataset], b: [string, Dataset]) =>
//       new Date(b[1].createdAt).getTime() -
//       new Date(a[1].createdAt).getTime(),
//     title: "Date Added"
//   }
// };

// //export default sortFunctions;

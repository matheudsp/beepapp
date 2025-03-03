
type TxKeyPath = "HomeScreen:goodMorning" | "HomeScreen:goodAfternoon" | "HomeScreen:goodEvening" ;

const Greeting = () => {
 


    const hour = new Date().getHours();
    let key: TxKeyPath = "HomeScreen:goodMorning" || undefined;

    switch (true) {
      case hour >= 5 && hour < 12:
        key = "HomeScreen:goodMorning";
        break;
      case hour >= 12 && hour < 18:
        key = "HomeScreen:goodAfternoon";
        break;
      default:
        key = "HomeScreen:goodEvening";
        break;
    }

    return (key);

  
};


export default Greeting;

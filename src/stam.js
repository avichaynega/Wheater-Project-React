function order_students_results(studentIds, studentHouses, professorFavoriteHouseList) {
    const prioretyHouse = {};


    professorFavoriteHouseList.forEach((house, index) => prioretyHouse[house] = index);
  
    const results = studentIds.map((id, index) => ({ id, house: studentHouses[index] }));
  
    results.sort((i, j) => {
      const iPriority = prioretyHouse[i.house];
      const jPriority = prioretyHouse[j.house];
  
      if (iPriority === jPriority) {
        return i.id - j.id;
      } else {
        return iPriority - jPriority;
      }
    });
  
    return results.map(application => application.id);
  }
  
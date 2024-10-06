import 'package:flutter/material.dart';
import '../cards/flight_card.dart';
import 'package:planpals/features/travel_planner/models/flight_model.dart';

class FlightListView extends StatelessWidget {
  final List<Flight> flightList;
  final VoidCallback onAdd;

  const FlightListView({
    super.key, 
    required this.flightList,
    required this.onAdd,    
  });

  @override
  Widget build(BuildContext context) {

    if(flightList.isNotEmpty) {
      return 
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: flightList.length + 1, //increment by 1 because index 0 is used for header
          itemBuilder: (context, index) {

            if (index == 0) {
              // return the header for flights
              return ListTile(
                leading: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.airplanemode_on, size: 35,),
                    SizedBox(width: 15,),
                    Text('Flights', style: TextStyle(fontSize: 25, fontWeight: FontWeight.bold)),
                ]),
                trailing: IconButton(
                  onPressed: onAdd, 
                  icon: const Icon(Icons.add_circle, size: 30,)
                ),
              );
              
            } else {
              // return the list of flights
              return FlightCard(
                flight: flightList[index - 1],  //decrement because index 0 is used for header
                onEdit: () {
                  return;
                },
                onDelete: () {
                  return;
                },
              );
            } 
          },  
        );

    } else {
      // return the header and a message that there's no flight
      return Column(
        children: [
          ListTile(
            leading: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.airplanemode_on, size: 35,),
                SizedBox(width: 15,),
                Text('Flights', style: TextStyle(fontSize: 25, fontWeight: FontWeight.bold)),
            ]),
            trailing: IconButton(
              onPressed: onAdd, 
              icon: const Icon(Icons.add_circle, size: 30,)
            ),
          ),
          const SizedBox(height: 5,),
          const Text("There is no flight", style: TextStyle(fontSize: 20)),
        ]
      );
    }
  }
}
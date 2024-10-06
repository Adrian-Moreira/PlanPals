import 'package:flutter/material.dart';
import '../cards/accommodation_card.dart';
import 'package:planpals/features/travel_planner/models/accommodation_model.dart';

class AccommodationListView extends StatelessWidget {
  final List<Accommodation> accommodationList;
  final VoidCallback onAdd;

  const AccommodationListView({
    super.key, 
    required this.accommodationList,
    required this.onAdd,    
  });

  @override
  Widget build(BuildContext context) {

    if (accommodationList.isNotEmpty) {
      return 
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: accommodationList.length + 1,  // increment by 1 because index 0 is used for header
          itemBuilder: (context, index) {

            if (index == 0) {
              //  return the header for accommodations
              return
                ListTile(
                  leading: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.hotel, size: 35,),
                      SizedBox(width: 15,),
                      Text('Accomodations', style: TextStyle(fontSize: 25, fontWeight: FontWeight.bold)),
                    ]),
                  trailing: IconButton(
                    onPressed: onAdd, 
                    icon: const Icon(Icons.add_circle, size: 30,)
                  ),
                );
            } else {
              // return the list of accommodations
              return 
                AccommodationCard(
                  accommodation: accommodationList[index-1],  //decrement because index 0 is used for header
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
      // return the header and a message that there is no accommodation
      return Column(
        children: [
          ListTile(
            leading: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.hotel, size: 35,),
                SizedBox(width: 15,),
                Text('Accomodations', style: TextStyle(fontSize: 25, fontWeight: FontWeight.bold)),
              ]),
            trailing: IconButton(
              onPressed: onAdd, 
              icon: const Icon(Icons.add_circle, size: 30,)
            ),
          ),
          const SizedBox(height: 5,),
          const Text("There is no accommodation", style: TextStyle(fontSize: 20)),
        ]
      );
    }
  }
}
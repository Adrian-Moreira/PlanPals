import 'package:flutter/material.dart';
import '../cards/activity_card.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';

class ActivityListView extends StatelessWidget {
  final List<Activity> activityList;
  final VoidCallback onAdd;

  const ActivityListView({
    super.key, 
    required this.activityList,
    required this.onAdd,    
  });

  @override
  Widget build(BuildContext context) {

    if (activityList.isNotEmpty) {
      return 
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: activityList.length + 1, // increment by 1 because index 0 is used for header
          itemBuilder: (context, index) {

            if (index == 0) {
              return
                ListTile(
                  leading: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.event, size: 35,),
                        SizedBox(width: 15,),
                        Text('Activities', style: TextStyle(fontSize: 25, fontWeight: FontWeight.bold)),
                  ]),
                  trailing: IconButton(
                    onPressed: onAdd, 
                    icon: const Icon(Icons.add_circle, size: 30,)
                  ),
                );
            } else {
              return ActivityCard(
              activity: activityList[index - 1], // decrement because index 0 is used for header,
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
      return Column(
        children: [
          ListTile(
            leading: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.event, size: 35,),
                  SizedBox(width: 15,),
                  Text('Activities', style: TextStyle(fontSize: 25, fontWeight: FontWeight.bold)),
            ]),
            trailing: IconButton(
              onPressed: onAdd, 
              icon: const Icon(Icons.add_circle, size: 30,)
            ),
          ),
          const SizedBox(height: 5,),
          const Text("There is no activity", style: TextStyle(fontSize: 20)),
        ]
      );
    }
  }
}
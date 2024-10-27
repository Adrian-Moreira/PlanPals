import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';

class ActivityCard extends StatelessWidget {
  final Activity activity;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final bool functional;

  const ActivityCard(
      {super.key,
      required this.activity,
      required this.onEdit,
      required this.onDelete,
      required this.functional});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
          title: Text(activity.name),
<<<<<<< HEAD:front-end-android/planpals/lib/features/travel_planner/views/components/cards/activity_card.dart
          subtitle: 
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Date: ${DateTimeFormat.formatDateTime(activity.date)}',),
              Text('Duration: ${activity.duration} minutes',),
            ]
          ),
=======
          subtitle: Text('${activity.date}, ${activity.time}'),
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/travel_planner/views/components/cards/activity_card.dart
          trailing: functional
              ? Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.edit),
                      onPressed: onEdit, // Handle the edit logic
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete),
                      onPressed: onDelete, // Handle the delete logic
                    ),
                  ],
                )
              : null),
    );
  }
}

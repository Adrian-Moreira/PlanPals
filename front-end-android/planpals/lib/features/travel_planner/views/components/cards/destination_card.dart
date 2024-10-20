import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/update/update_destination_form.dart';
import 'package:planpals/shared/components/delete_message.dart';
import 'package:planpals/shared/utils/date_utils.dart';
import 'package:provider/provider.dart';

class DestinationCard extends StatelessWidget {
  final Destination destination;
  final bool functional;

  const DestinationCard(
      {super.key,
      required this.destination,
      required this.functional});

  @override
  Widget build(BuildContext context) {
    PlannerViewModel plannerViewModel = Provider.of<PlannerViewModel>(context, listen: false);
    User user = Provider.of<UserViewModel>(context, listen: false).currentUser!;


    return Card(
      child: ListTile(
          title: Text(destination.name,
              style: const TextStyle(fontWeight: FontWeight.bold)),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                  'Departure: ${DateTimeFormat.formatDateTime(destination.startDate)}'),
              Text(
                  'Arrival: ${DateTimeFormat.formatDateTime(destination.endDate)}'),
            ],
          ),
          trailing: functional
              ? Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.edit),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => UpdateDestinationForm(
                                    destination: destination,
                                  )),
                        );
                      }, // Handle the edit logic
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete),
                      onPressed: () {
                        showDialog(
                          context: context, 
                          builder: (context) => DeleteMessage(
                            onDelete: () {

                              print("DELETING DESTINATION: $destination");

                              // Delete the destination
                              plannerViewModel.deleteDestination(destination, user.id);

                            },
                          ));
                      }, // Handle the delete logic
                    ),
                  ],
                )
              : null),
    );
  }
}

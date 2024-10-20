import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/update/update_transport_form.dart';
import 'package:planpals/shared/components/delete_message.dart';
import 'package:planpals/shared/utils/date_utils.dart';
import 'package:provider/provider.dart';

class TransportCard extends StatelessWidget {
  final Transport transport;
  final bool functional;

  const TransportCard(
      {super.key,
      required this.transport,
      required this.functional});

  @override
  Widget build(BuildContext context) {
    PlannerViewModel plannerViewModel = Provider.of<PlannerViewModel>(context, listen: false);
    User user = Provider.of<UserViewModel>(context, listen: false).currentUser!;

    return Card(
      child: ListTile(
          title: Text(transport.type, style: const TextStyle(fontWeight: FontWeight.bold)),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                  'Departure: ${DateTimeFormat.formatDateTime(transport.departureTime)}'),
              Text(
                  'Arrival: ${DateTimeFormat.formatDateTime(transport.arrivalTime)}'),
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
                          MaterialPageRoute(builder: (context) => UpdateTransportForm(transport: transport)));
                      }, // Handle the edit logic
                      tooltip: 'Edit',
                      
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete),
                      onPressed: () {
                        showDialog(
                          context: context, 
                          builder: (context) => DeleteMessage(onDelete: () {
                            
                            // Delete Transport
                            plannerViewModel.deleteTransport(transport, user.id);

                          }));

                      }, // Handle the delete logic
                    ),
                  ],
                )
              : null),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/destination_form.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/transport_form.dart';
import 'package:planpals/features/travel_planner/views/components/cards/destination_card.dart';
import 'package:planpals/features/travel_planner/views/components/cards/transport_card.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/shared/components/generic_list_view.dart';
import 'package:planpals/shared/components/invite_user_dialog.dart';
import 'package:planpals/shared/components/navigator_bar.dart';
import 'package:planpals/shared/utils/date_utils.dart';

class PlannerDetailsView extends StatefulWidget {
  final Planner travelPlanner;

  const PlannerDetailsView({super.key, required this.travelPlanner});

  @override
  State<PlannerDetailsView> createState() => _PlannerDetailsViewState();
}

class _PlannerDetailsViewState extends State<PlannerDetailsView> {
  User? user;
  bool functional = false;

  @override
  void initState() {
    super.initState();
    Planner travelPlanner = widget.travelPlanner; // get planner from widget
    user = Provider.of<UserViewModel>(context, listen: false).currentUser;  // get user from provider
    WidgetsBinding.instance.addPostFrameCallback((_) {
      // fetch destinations and transports for planner
      Provider.of<PlannerViewModel>(context, listen: false)
          .fetchAllDestinationsByUserId(travelPlanner.plannerId, user!.id);
      Provider.of<PlannerViewModel>(context, listen: false)
          .fetchAllTransportsByUserId(travelPlanner.plannerId, user!.id);
    });

    _initializeUserAndFunctional();
  }

  void _initializeUserAndFunctional() {

    // Check if the user is a Read-Write-User
    if (user != null) {
      functional = widget.travelPlanner.rwUsers.contains(user!.id);
    }
  } 

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: NavigatorAppBar(title: widget.travelPlanner.name),
      body: _buildPlanner(context, widget.travelPlanner),
    );
  }

  Widget _buildPlanner(BuildContext context, Planner planner) {
    PlannerViewModel plannerViewModel = Provider.of<PlannerViewModel>(context);

    List<Destination> destinations = plannerViewModel.destinations;
    List<Transport> transportations = plannerViewModel.transports;

    return CustomScrollView(
      slivers: [
        // Sliver app bar
        // const SliverAppBar(
        //   expandedHeight: 250.0,
        //   flexibleSpace: FlexibleSpaceBar(
        //     background: Icon(
        //       Icons.image,
        //       size: 200,
        //     ),
        //     centerTitle: true,
        //   ),
        //   backgroundColor: Color.fromRGBO(122, 22, 124, 1.0),
        // ),

        SliverToBoxAdapter(
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ListTile(
                  title: Text(
                    widget.travelPlanner.name,
                    style: const TextStyle(fontSize: 30),
                  ),
                  subtitle: Text(
                      '${DateTimeFormat.formatDate(widget.travelPlanner.startDate)} - ${DateTimeFormat.formatDate(widget.travelPlanner.endDate)}',
                      style: const TextStyle(fontSize: 18)),
                  trailing: IconButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) =>
                                InviteUserDialog()), // navigate to travel planners
                      );
                    },
                    icon: const Icon(
                      Icons.group_add,
                      size: 40,
                    ),
                  ),
                ),
                ListTile(
                  leading: Container(
                    padding:
                        const EdgeInsets.all(10), // Padding around the icon
                    decoration: BoxDecoration(
                      color: const Color.fromARGB(
                          255, 223, 223, 223), // Background color
                      borderRadius: BorderRadius.circular(8), // Rounded corners
                    ),
                    child: const Icon(
                      Icons.description,
                      size: 30, // Icon size // Icon color
                    ),
                  ),
                  title: const Text(
                      'Description', 
                      style: TextStyle(fontWeight: FontWeight.bold),),
                  subtitle: Text(widget.travelPlanner.description),
                ),
                ListTile(
                  leading: Container(
                    padding:
                        const EdgeInsets.all(10), // Padding around the icon
                    decoration: BoxDecoration(
                      color: const Color.fromARGB(
                          255, 223, 223, 223), // Background color
                      borderRadius: BorderRadius.circular(8), // Rounded corners
                    ),
                    child: const Icon(
                      Icons.calendar_month,
                      size: 30, // Icon size // Icon color
                    ),
                  ),
                  title: Text(
                      '${widget.travelPlanner.endDate.difference(widget.travelPlanner.startDate).inDays} Days', 
                      style: const TextStyle(fontWeight: FontWeight.bold),),
                  subtitle:
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('${widget.travelPlanner.destinations.length} Destinations'),
                          Text('${widget.travelPlanner.transportations.length} Transportations'), 
                        ]),
                ),
                ListTile(
                  leading: Container(
                    padding:
                        const EdgeInsets.all(10), // Padding around the icon
                    decoration: BoxDecoration(
                      color: const Color.fromARGB(
                          255, 223, 223, 223), // Background color
                      borderRadius: BorderRadius.circular(8), // Rounded corners
                    ),
                    child: const Icon(
                      Icons.group_rounded,
                      size: 30, // Icon size // Icon color
                    ),
                  ),
                  title: const Text('Members', style: TextStyle(fontWeight: FontWeight.bold),),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${planner.rwUsers.length} Read-Write Members'),
                      const SizedBox(
                        width: 10,
                      ),
                      Text('${planner.roUsers.length} Read-Only Members'),
                    ],
                  ),
                ),
                GenericListView(
                  itemList: destinations,
                  itemBuilder: (destination) => DestinationCard(
                    destination: destination,
                    onEdit: () {},
                    onDelete: () {},
                    functional: functional,
                  ),
                  onAdd: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) =>
                                DestinationForm(planner: planner)));
                  },
                  headerTitle: "Destinations",
                  headerIcon: Icons.landscape,
                  emptyMessage: "There is no destination",
                  functional: functional,
                ),
                const SizedBox(
                  height: 20,
                ),
                const Divider(height: 1),
                const SizedBox(
                  height: 10,
                ),
                GenericListView(
                  itemList: transportations,
                  itemBuilder: (transport) => TransportCard(
                    transport: transport,
                    onEdit: () {},
                    onDelete: () {},
                    functional: functional,
                  ),
                  onAdd: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => TransportForm(
                                  planner: planner,
                                )));
                  },
                  headerTitle: "Transportations",
                  headerIcon: Icons.emoji_transportation,
                  emptyMessage: "There is no transportation",
                  functional: functional,
                  scrollable: false,
                ),
                const SizedBox(
                  height: 20,
                ),
                const Divider(height: 1),
                const SizedBox(
                  height: 10,
                ),
                const SizedBox(
                  height: 20,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

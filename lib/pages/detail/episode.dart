import 'package:api/api.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:player_view/player.dart';

import '../../components/async_image.dart';
import '../../components/future_builder_handler.dart';
import '../../components/gap.dart';
import '../../mixins/update.dart';
import '../../models/models.dart';
import '../../utils/notification.dart';
import '../../utils/player.dart';
import '../../utils/utils.dart';
import 'components/actors.dart';
import 'components/episodes.dart';
import 'components/overview.dart';
import 'dialogs/episode_metadata.dart';
import 'dialogs/subtitle.dart';
import 'mixins/detail_page.dart';
import 'utils/tmdb_uri.dart';

class EpisodeDetail extends StatefulWidget {
  final int tvEpisodeId;
  final TVEpisode? initialData;

  const EpisodeDetail({super.key, required this.tvEpisodeId, this.initialData});

  @override
  State<EpisodeDetail> createState() => _EpisodeDetailState();
}

class _EpisodeDetailState extends State<EpisodeDetail> with DetailPageMixin<TVEpisode, EpisodeDetail>, NeedUpdateMixin {
  @override
  TVEpisode? get initialData => widget.initialData;

  @override
  double get floatWidth => 240;

  @override
  Future<TVEpisode> future() => Api.tvEpisodeQueryById(widget.tvEpisodeId);

  @override
  Widget buildFloatImage(BuildContext context, TVEpisode item) {
    return AspectRatio(aspectRatio: 1.667, child: item.poster != null ? AsyncImage(item.poster!) : const Icon(Icons.image_not_supported, size: 50));
  }

  @override
  Widget buildTitle(BuildContext context, TVEpisode item) {
    return Text('${item.episode}. ${item.displayTitle()}');
  }

  @override
  Widget buildSubTitle(BuildContext context, TVEpisode item) {
    return RichText(
      text: TextSpan(
        style: Theme.of(context).textTheme.labelSmall!,
        children: [
          TextSpan(text: item.seriesTitle),
          const WidgetSpan(child: SizedBox(width: 6)),
          TextSpan(text: AppLocalizations.of(context)!.seasonNumber(item.season)),
          const WidgetSpan(child: SizedBox(width: 10)),
          if (item.airDate != null) TextSpan(text: item.airDate?.format() ?? AppLocalizations.of(context)!.tagUnknown),
        ],
      ),
    );
  }

  @override
  List<ActionEntry> buildActions(BuildContext context, TVEpisode item) {
    return [
      buildPlayAction(context, () => play(item)),
      buildFavoriteAction(context, item, MediaType.episode),
      if (!kIsAndroidTV) buildCastAction(context, (device) => cast(item, device)),
      ActionDivider(),
      buildSkipFromStartAction(context, item, MediaType.episode, item.skipIntro),
      buildSkipFromEndAction(context, item, MediaType.episode, item.skipEnding),
      ActionDivider(),
      buildEditMetadataAction(context, () async {
        final res = await showDialog<(String, int)>(context: context, builder: (context) => EpisodeMetadata(episode: item));
        if (res != null) {
          final (title, episode) = res;
          await Api.tvEpisodeMetadataUpdateById(id: item.id, title: title, episode: episode);
          setState(() => refresh = true);
        }
      }),
      ActionButton(
        text: Text(AppLocalizations.of(context)!.buttonSubtitle),
        icon: const Icon(Icons.subtitles_outlined),
        collapsed: true,
        onPressed: () async {
          final subtitle = await showDialog<SubtitleData>(context: context, builder: (context) => SubtitleDialog(subtitle: item.subtitles.firstOrNull));
          if (subtitle != null && context.mounted) {
            final resp = await showNotification(context, Api.tvEpisodeSubtitleUpdateById(id: item.id, subtitle: subtitle));
            if (resp?.error == null) setState(() => refresh = true);
          }
        },
      ),
      ActionButton(
        text: Text(AppLocalizations.of(context)!.buttonDownload),
        icon: const Icon(Icons.download_outlined),
        trailing: const Badge(label: Text('Beta1')),
        collapsed: true,
        onPressed: () async {
          final resp =
              await showNotification(context, Api.downloadTaskCreate(item.id, MediaType.episode), successText: AppLocalizations.of(context)!.tipsForDownload);
          if (resp?.error == null) setState(() => refresh = true);
        },
      ),
      ActionDivider(),
      buildDeleteAction(context, () => Api.tvEpisodeDeleteById(item.id)),
    ];
  }

  @override
  SliverChildDelegate buildChild(BuildContext context, TVEpisode item) {
    return SliverChildListDelegate([
      OverviewSection(
          item: item,
          description: RichText(
              text: TextSpan(children: [
            TextSpan(text: '${item.filename}.${item.ext}', style: Theme.of(context).textTheme.labelSmall),
            const WidgetSpan(child: Gap.hSM),
            TextSpan(text: item.fileSize.toSizeDisplay(), style: Theme.of(context).textTheme.labelSmall),
          ]))),
      FutureBuilderHandler<List<TVEpisode>>(
        initialData: const [],
        future: Api.tvSeasonQueryById(item.seasonId).then((value) => value.episodes),
        builder: (context, snapshot) => EpisodesSection(episodes: snapshot.requireData, season: item.season, onTap: play),
      ),
      ActorsSection(actors: item.actors),
    ]);
  }

  play(TVEpisode item) async {
    final season = await Api.tvSeasonQueryById(item.seasonId);
    if (!mounted) return;
    await toPlayer(
      context,
      season.episodes.map((episode) => FromMedia.fromEpisode(episode)).toList(),
      playerType: PlayerType.tv,
      id: item.id,
    );
    setState(() => refresh = true);
  }

  cast(TVEpisode item, CastDevice device) async {
    final season = await Api.tvSeasonQueryById(item.seasonId);
    if (!mounted) return;
    await toPlayerCast(
      context,
      device,
      season.episodes.map((episode) => FromMedia.fromEpisode(episode)).toList(),
      id: item.id,
    );
    setState(() => refresh = true);
  }
}

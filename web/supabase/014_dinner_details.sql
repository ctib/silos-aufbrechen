-- 014: Abendprogramm-Details: Drei Teilstationen statt nur ein Boolean
--
-- Die drei Stationen der MS Stadt Kiel:
--   dinner_dietrichsdorf  = Ab Anleger Dietrichsdorf (18:30)
--   dinner_hbf            = Ab Anleger Hauptbahnhof (19:45)
--   dinner_ausklang       = Ausklang an der Reventloubruecke (ab 20:15)
--
-- attends_dinner bleibt als Hauptschalter bestehen.
-- Die Detail-Spalten sind nur relevant wenn attends_dinner = true.

ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS dinner_dietrichsdorf boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS dinner_hbf            boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS dinner_ausklang       boolean NOT NULL DEFAULT true;

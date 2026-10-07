-- Live auctions are watched on the site's own /live page instead of an external stream link.
alter table public.auctions drop column stream_url;

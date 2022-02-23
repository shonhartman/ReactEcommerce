/* eslint-disable no-plusplus */
import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo that we are taking care of everything
    read(existing = [], { args, cache }) {
      const { skip, first } = args;

      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // check if we have existing itesm
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // if there are items
      // AND there aren't enough to satisfy how many were requested
      // AND we are on the last page
      // JUST SEND IT
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // we don't have any items, fetch from the network
        return false;
      }

      // if there are items, return them from the cache, we don't need to fetch from the network
      if (items.length) {
        return items;
      }

      return false; // fallback to network
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // this runs when apollo comes back from the network call with our product
      const merged = existing ? existing.slice(0) : [];
      merged.push(incoming);

      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }

      // finally return merged items from the cache
      return merged;
    },
  };
}

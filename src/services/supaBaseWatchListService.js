export async function AddStock(supabase, symbol, userId){
    await supabase.from("watchlist").insert({symbol,user_id:userId});
}

export async function RemoveStock(supabase, id){
    return supabase.from("watchlist").delete().eq("id", id);
}

export async function FetchWatchList(supabase, userId){
    const { data } = await supabase
    .from("watchlist")
    .select("id, symbol")
    .eq("user_id", userId);
    return data || null;
} 
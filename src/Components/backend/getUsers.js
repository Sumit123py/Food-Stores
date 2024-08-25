const supabase = require('./Supabase'); // Use require instead of import

async function getUser() {
    // Query all users with related orders details
    const { data, error } = await supabase
        .from('users')
        .select(`
            *,
            Orders (
                Approval
            )
        `);

    if (error) {
        console.error(error);
        throw new Error("Orders could not be loaded");
    }

    console.log(data)

    return data;
}

module.exports = { getUser };
